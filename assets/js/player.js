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
  return playerVoices.find(v => /de-DE/i.test(v.lang)) || playerVoices.find(v => /^de/i.test(v.lang)) || null;
}

function stopSpeech() {
  speechSynthesis.cancel();
  playerUtterance = null;
  clearTimeout(playerShadowTimeout);
}

function updatePlayerUI() {
  const lesson = window.currentLesson;
  if (!lesson) return;

  const index = window.lessonProgress.currentIndex;
  const total = lesson.sentences.length;

  document.getElementById('segmentInfo').textContent = `Фраза ${Math.min(index + 1, total)} / ${total}`;
  document.getElementById('playerStatus').textContent = window.lessonProgress.shadowMode
    ? 'Shadowing mode'
    : window.lessonProgress.slowMode
      ? 'Slow mode'
      : 'Ready';

  const progress = (index / total) * 100;
  document.getElementById('progressBar').style.width = `${progress}%`;

  document.querySelectorAll('.sentence').forEach((el, i) => {
    el.classList.toggle('active', i === index);
  });
}

function speakCurrentSentence() {
  const lesson = window.currentLesson;
  if (!lesson) return;

  const index = window.lessonProgress.currentIndex;
  if (index < 0 || index >= lesson.sentences.length) return;

  stopSpeech();

  const utterance = new SpeechSynthesisUtterance(lesson.sentences[index]);
  const voice = getGermanVoice();
  utterance.lang = voice ? voice.lang : 'de-DE';
  if (voice) utterance.voice = voice;
  utterance.rate = window.lessonProgress.slowMode ? 0.8 : 1;
  utterance.pitch = 1;
  utterance.volume = 1;

  playerUtterance = utterance;
  document.getElementById('playerStatus').textContent = `Playing sentence ${index + 1}`;

  utterance.onend = () => {
    if (window.lessonProgress.shadowMode) {
      playerShadowTimeout = setTimeout(() => {
        window.lessonProgress.currentIndex++;
        if (window.lessonProgress.currentIndex < lesson.sentences.length) {
          speakCurrentSentence();
        } else {
          document.getElementById('playerStatus').textContent = 'Finished';
        }
        updatePlayerUI();
      }, 2200);
    } else {
      window.lessonProgress.currentIndex++;
      if (window.lessonProgress.currentIndex < lesson.sentences.length) {
        speakCurrentSentence();
      } else {
        document.getElementById('playerStatus').textContent = 'Finished';
      }
      updatePlayerUI();
    }
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

  if (pauseBtn) pauseBtn.addEventListener('click', () => {
    stopSpeech();
    document.getElementById('playerStatus').textContent = 'Paused';
  });

  if (prevBtn) prevBtn.addEventListener('click', () => {
    stopSpeech();
    window.lessonProgress.currentIndex = Math.max(0, window.lessonProgress.currentIndex - 1);
    updatePlayerUI();
  });

  if (nextBtn) nextBtn.addEventListener('click', () => {
    stopSpeech();
    window.lessonProgress.currentIndex = Math.min(window.currentLesson.sentences.length - 1, window.lessonProgress.currentIndex + 1);
    updatePlayerUI();
  });

  if (slowBtn) slowBtn.addEventListener('click', () => {
    window.lessonProgress.slowMode = !window.lessonProgress.slowMode;
    window.lessonProgress.shadowMode = false;
    updatePlayerUI();
  });

  if (shadowBtn) shadowBtn.addEventListener('click', () => {
    window.lessonProgress.shadowMode = !window.lessonProgress.shadowMode;
    window.lessonProgress.slowMode = false;
    updatePlayerUI();
  });

  window.updatePlayerUI = updatePlayerUI;
});
