// assets/js/player.js

let playerVoices = [];
let playerUtterance = null;
let playerShadowTimeout = null;

function loadPlayerVoices() {
  playerVoices = speechSynthesis.getVoices();
}

loadPlayerVoices();
window.speechSynthesis.onvoiceschanged = loadPlayerVoices;

function getGermanVoice() {
  return (
    playerVoices.find(v => /de-DE/i.test(v.lang)) ||
    playerVoices.find(v => /^de/i.test(v.lang)) ||
    null
  );
}

function stopSpeech() {
  speechSynthesis.cancel();
  playerUtterance = null;
  clearTimeout(playerShadowTimeout);
  playerShadowTimeout = null;
}

function updatePlayerUI() {
  const state = window.lessonState;
  if (!state || !state.lesson) return;

  const lesson = state.lesson;
  const index = state.currentSentenceIndex;
  const total = lesson.sentences.length;

  const segmentInfo = document.getElementById('segmentInfo');
  const playerStatus = document.getElementById('playerStatus');
  const progressBar = document.getElementById('progressBar');

  if (segmentInfo) {
    segmentInfo.textContent = `Фраза ${Math.min(index + 1, total)} / ${total}`;
  }

  if (playerStatus) {
    if (state.shadowMode) {
      playerStatus.textContent = 'Shadowing mode';
    } else if (state.slowMode) {
      playerStatus.textContent = 'Slow mode';
    } else {
      playerStatus.textContent = 'Ready';
    }
  }

  if (progressBar) {
    const progress = (index / total) * 100;
    progressBar.style.width = `${progress}%`;
  }

  document.querySelectorAll('.sentence').forEach((el, i) => {
    el.classList.toggle('active', i === index);
  });
}

function speakCurrentSentence() {
  const state = window.lessonState;
  if (!state || !state.lesson) return;

  const lesson = state.lesson;
  const index = state.currentSentenceIndex;

  if (index < 0 || index >= lesson.sentences.length) return;

  stopSpeech();

  const utterance = new SpeechSynthesisUtterance(lesson.sentences[index]);
  const voice = getGermanVoice();

  utterance.lang = voice ? voice.lang : 'de-DE';
  if (voice) utterance.voice = voice;
  utterance.rate = state.slowMode ? 0.8 : 1;
  utterance.pitch = 1;
  utterance.volume = 1;

  playerUtterance = utterance;

  const playerStatus = document.getElementById('playerStatus');
  if (playerStatus) {
    playerStatus.textContent = `Playing sentence ${index + 1}`;
  }

  utterance.onend = () => {
    if (state.shadowMode) {
      playerShadowTimeout = setTimeout(() => {
        state.currentSentenceIndex++;
        if (state.currentSentenceIndex < lesson.sentences.length) {
          speakCurrentSentence();
        } else {
          const status = document.getElementById('playerStatus');
          if (status) status.textContent = 'Finished';
        }
        updatePlayerUI();
      }, 2200);
    } else {
      state.currentSentenceIndex++;
      if (state.currentSentenceIndex < lesson.sentences.length) {
        speakCurrentSentence();
      } else {
        const status = document.getElementById('playerStatus');
        if (status) status.textContent = 'Finished';
      }
      updatePlayerUI();
    }
  };

  utterance.onerror = () => {
    const status = document.getElementById('playerStatus');
    if (status) status.textContent = 'Speech error';
  };

  speechSynthesis.speak(utterance);
  updatePlayerUI();
}

document.addEventListener('DOMContentLoaded', () => {
  const playBtn = document.getElementById('playBtn');
  const pauseBtn = document.getElementById('pauseBtn');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const slowBtn = document.getElementById('slowBtn');
  const shadowBtn = document.getElementById('shadowBtn');

  if (playBtn) playBtn.addEventListener('click', speakCurrentSentence);

  if (pauseBtn) {
    pauseBtn.addEventListener('click', () => {
      stopSpeech();
      const status = document.getElementById('playerStatus');
      if (status) status.textContent = 'Paused';
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      stopSpeech();
      const state = window.lessonState;
      if (!state || !state.lesson) return;
      state.currentSentenceIndex = Math.max(0, state.currentSentenceIndex - 1);
      updatePlayerUI();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      stopSpeech();
      const state = window.lessonState;
      if (!state || !state.lesson) return;
      state.currentSentenceIndex = Math.min(state.lesson.sentences.length - 1, state.currentSentenceIndex + 1);
      updatePlayerUI();
    });
  }

  if (slowBtn) {
    slowBtn.addEventListener('click', () => {
      const state = window.lessonState;
      if (!state) return;
      state.slowMode = !state.slowMode;
      state.shadowMode = false;
      updatePlayerUI();
    });
  }

  if (shadowBtn) {
    shadowBtn.addEventListener('click', () => {
      const state = window.lessonState;
      if (!state) return;
      state.shadowMode = !state.shadowMode;
      state.slowMode = false;
      updatePlayerUI();
    });
  }

  window.updatePlayerUI = updatePlayerUI;
  window.stopSpeech = stopSpeech;
});
