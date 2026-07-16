// assets/js/recorder.js
let recorderInstance = null;
let recorderChunks = [];

function renderRecording(url, index) {
  const list = document.getElementById('recordingsList');
  if (!list) return;

  const item = document.createElement('div');
  item.className = 'recording-item';
  item.innerHTML = `
    <strong>Recording ${index + 1}</strong>
    <audio controls src="${url}"></audio>
  `;
  list.prepend(item);
}

document.addEventListener('DOMContentLoaded', () => {
  const recordBtn = document.getElementById('recordBtn');
  const stopRecordBtn = document.getElementById('stopRecordBtn');
  const recordStatus = document.getElementById('recordStatus');

  if (!recordBtn || !stopRecordBtn) return;

  recordBtn.addEventListener('click', async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      recordStatus.textContent = 'Recording is not supported in this browser.';
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      recorderChunks = [];
      recorderInstance = new MediaRecorder(stream);

      recorderInstance.ondataavailable = e => {
        if (e.data.size > 0) recorderChunks.push(e.data);
      };

      recorderInstance.onstop = () => {
        const blob = new Blob(recorderChunks, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        const recordings = JSON.parse(localStorage.getItem('da_recordings') || '[]');
        recordings.push({ url, createdAt: new Date().toISOString() });
        localStorage.setItem('da_recordings', JSON.stringify(recordings));
        renderRecording(url, recordings.length - 1);
        recordStatus.textContent = 'Recording saved locally.';
        stream.getTracks().forEach(track => track.stop());
      };

      recorderInstance.start();
      recordStatus.textContent = 'Recording...';
      recordBtn.disabled = true;
      stopRecordBtn.disabled = false;
    } catch (err) {
      recordStatus.textContent = 'Microphone access denied.';
    }
  });

  stopRecordBtn.addEventListener('click', () => {
    if (recorderInstance && recorderInstance.state !== 'inactive') {
      recorderInstance.stop();
    }
    recordBtn.disabled = false;
    stopRecordBtn.disabled = true;
  });

  const saved = JSON.parse(localStorage.getItem('da_recordings') || '[]');
  saved.forEach((rec, index) => renderRecording(rec.url, index));
});
