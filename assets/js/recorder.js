// assets/js/recorder.js

let mediaRecorder = null;
let recordedChunks = [];
let currentRecordingUrl = null;
let currentRecordingBlob = null;

function getCurrentLessonId() {
  const state = window.lessonState;
  return state?.lesson?.id || null;
}

function getRecordingKey(lessonId) {
  return `da_recording_${lessonId}`;
}

function clearCurrentRecordingUrl() {
  if (currentRecordingUrl) {
    URL.revokeObjectURL(currentRecordingUrl);
    currentRecordingUrl = null;
  }
}

function updateRecordingStatus(text) {
  const status = document.getElementById('recordingStatus');
  if (status) {
    status.textContent = text;
  }
}

function updateRecordingUI(hasRecording) {
  const playBtn = document.getElementById('playRecordingBtn');
  const deleteBtn = document.getElementById('deleteRecordingBtn');

  if (playBtn) playBtn.disabled = !hasRecording;
  if (deleteBtn) deleteBtn.disabled = !hasRecording;
}

function saveRecordingForLesson(lessonId, blob) {
  const reader = new FileReader();

  reader.onloadend = () => {
    try {
      const payload = {
        createdAt: new Date().toISOString(),
        mimeType: blob.type || 'audio/webm',
        dataUrl: reader.result
      };

      localStorage.setItem(getRecordingKey(lessonId), JSON.stringify(payload));
      updateRecordingStatus('Запись сохранена');
      updateRecordingUI(true);
    } catch (error) {
      console.error('Error saving recording:', error);
      updateRecordingStatus('Ошибка сохранения записи');
    }
  };

  reader.onerror = () => {
    console.error('Error reading blob as data URL');
    updateRecordingStatus('Ошибка чтения записи');
  };

  reader.readAsDataURL(blob);
}

function loadRecordingForLesson(lessonId) {
  try {
    const saved = localStorage.getItem(getRecordingKey(lessonId));
    if (!saved) return null;

    const payload = JSON.parse(saved);
    if (!payload?.dataUrl) return null;

    return payload;
  } catch (error) {
    console.error('Error loading recording:', error);
    return null;
  }
}

function renderRecordingForLesson() {
  const lessonId = getCurrentLessonId();
  if (!lessonId) {
    updateRecordingUI(false);
    updateRecordingStatus('Нет активного урока');
    return;
  }

  const saved = loadRecordingForLesson(lessonId);
  const audio = document.getElementById('recordingAudio');

  clearCurrentRecordingUrl();

  if (saved?.dataUrl) {
    currentRecordingBlob = null;
    currentRecordingUrl = saved.dataUrl;

    if (audio) {
      audio.src = saved.dataUrl;
    }

    updateRecordingUI(true);
    updateRecordingStatus('Запись загружена');
  } else {
    currentRecordingBlob = null;

    if (audio) {
      audio.removeAttribute('src');
      audio.load();
    }

    updateRecordingUI(false);
    updateRecordingStatus('Запись отсутствует');
  }
}

async function startRecording() {
  const lessonId = getCurrentLessonId();
  if (!lessonId) {
    updateRecordingStatus('Сначала откройте урок');
    return;
  }

  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    updateRecordingStatus('Запись не поддерживается браузером');
    return;
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    recordedChunks = [];
    mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = event => {
      if (event.data && event.data.size > 0) {
        recordedChunks.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(recordedChunks, { type: mediaRecorder.mimeType || 'audio/webm' });

      // Новая запись затирает старую для текущего урока
      saveRecordingForLesson(lessonId, blob);

      // Временный URL для текущей сессии
      clearCurrentRecordingUrl();
      currentRecordingBlob = blob;
      currentRecordingUrl = URL.createObjectURL(blob);

      const audio = document.getElementById('recordingAudio');
      if (audio) {
        audio.src = currentRecordingUrl;
      }

      // Останавливаем микрофон
      stream.getTracks().forEach(track => track.stop());
    };

    mediaRecorder.start();
    updateRecordingStatus('Идёт запись...');
  } catch (error) {
    console.error('Error starting recording:', error);
    updateRecordingStatus('Не удалось начать запись');
  }
}

function stopRecording() {
  if (mediaRecorder && mediaRecorder.state !== 'inactive') {
    mediaRecorder.stop();
    updateRecordingStatus('Обработка записи...');
  }
}

function playRecording() {
  const lessonId = getCurrentLessonId();
  if (!lessonId) return;

  const audio = document.getElementById('recordingAudio');
  if (!audio) return;

  if (audio.src) {
    audio.play().catch(error => {
      console.error('Error playing recording:', error);
      updateRecordingStatus('Не удалось воспроизвести запись');
    });
  } else {
    const saved = loadRecordingForLesson(lessonId);
    if (saved?.dataUrl) {
      audio.src = saved.dataUrl;
      audio.play().catch(error => {
        console.error('Error playing loaded recording:', error);
        updateRecordingStatus('Не удалось воспроизвести запись');
      });
    }
  }
}

function deleteRecording() {
  const lessonId = getCurrentLessonId();
  if (!lessonId) return;

  localStorage.removeItem(getRecordingKey(lessonId));
  clearCurrentRecordingUrl();
  currentRecordingBlob = null;

  const audio = document.getElementById('recordingAudio');
  if (audio) {
    audio.removeAttribute('src');
    audio.load();
  }

  updateRecordingUI(false);
  updateRecordingStatus('Запись удалена');
}

function bindRecorderButtons() {
  const startBtn = document.getElementById('recordStartBtn');
  const stopBtn = document.getElementById('recordStopBtn');
  const playBtn = document.getElementById('playRecordingBtn');
  const deleteBtn = document.getElementById('deleteRecordingBtn');

  if (startBtn) startBtn.addEventListener('click', startRecording);
  if (stopBtn) stopBtn.addEventListener('click', stopRecording);
  if (playBtn) playBtn.addEventListener('click', playRecording);
  if (deleteBtn) deleteBtn.addEventListener('click', deleteRecording);
}

function initRecorder() {
  bindRecorderButtons();
  renderRecordingForLesson();
}

document.addEventListener('DOMContentLoaded', initRecorder);

// Если урок меняется динамически, можно вызывать это вручную:
window.refreshLessonRecording = renderRecordingForLesson;
window.startRecording = startRecording;
window.stopRecording = stopRecording;
window.playRecording = playRecording;
window.deleteRecording = deleteRecording;
