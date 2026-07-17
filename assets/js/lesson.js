// assets/js/lesson.js

window.lessonState = {
  lesson: null,
  currentSentenceIndex: 0,
  slowMode: false,
  shadowMode: false
};

async function loadLessons() {
  try {
    const response = await fetch('data/lessons.json');
    if (!response.ok) {
      throw new Error(`Failed to load lessons.json: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error loading lessons:', error);
    return [];
  }
}

function getLessonIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id') || 'b1-01';
}

function renderLessonNav(lessons) {
  const nav = document.getElementById('lessonNav');
  if (!nav) return;

  nav.innerHTML = lessons.map(lesson => `
    <a href="lesson.html?id=${lesson.id}" class="lesson-nav-link">
      <strong>${lesson.level}</strong> · ${lesson.title}
    </a>
  `).join('');
}

function renderLesson(lesson) {
  if (!lesson) return;

  window.lessonState.lesson = lesson;
  window.lessonState.currentSentenceIndex = 0;
  window.lessonState.slowMode = false;
  window.lessonState.shadowMode = false;

  const lessonMeta = document.getElementById('lessonMeta');
  const lessonTitle = document.getElementById('lessonTitle');
  const lessonDescription = document.getElementById('lessonDescription');
  const sentenceStrip = document.getElementById('sentenceStrip');
  const vocabList = document.getElementById('vocabList');
  const questionList = document.getElementById('questionList');
  const progressBar = document.getElementById('progressBar');
  const segmentInfo = document.getElementById('segmentInfo');
  const playerStatus = document.getElementById('playerStatus');

  if (lessonMeta) lessonMeta.textContent = `${lesson.level} · ${lesson.topic}`;
  if (lessonTitle) lessonTitle.textContent = lesson.title;
  if (lessonDescription) lessonDescription.textContent = lesson.description;

  if (sentenceStrip) {
    sentenceStrip.innerHTML = lesson.sentences.map((sentence, index) => `
      <div class="sentence ${index === 0 ? 'active' : ''}" data-index="${index}">
        ${sentence}
      </div>
    `).join('');
  }

  if (vocabList) {
    vocabList.innerHTML = lesson.vocabulary.map(item => `
      <li class="vocab-item">
        <span class="vocab-de">${item.de}</span>
        <span class="vocab-separator">—</span>
        <span class="vocab-ru">${item.ru}</span>
      </li>
    `).join('');
  }

  if (questionList) {
    questionList.innerHTML = lesson.questions.map(question => `
      <div class="question-item">${question}</div>
    `).join('');
  }

  if (progressBar) progressBar.style.width = '0%';
  if (segmentInfo) segmentInfo.textContent = `Фраза 1 / ${lesson.sentences.length}`;
  if (playerStatus) playerStatus.textContent = 'Готов к воспроизведению';

  saveLessonProgress();
  updateSentenceHighlight();

  if (typeof window.updatePlayerUI === 'function') {
    window.updatePlayerUI();
  }
}

function updateSentenceHighlight() {
  const state = window.lessonState;
  if (!state || !state.lesson) return;

  const sentences = document.querySelectorAll('.sentence');
  sentences.forEach((el, index) => {
    el.classList.toggle('active', index === state.currentSentenceIndex);
  });

  const progressBar = document.getElementById('progressBar');
  const segmentInfo = document.getElementById('segmentInfo');

  const total = state.lesson.sentences.length;
  const progress = (state.currentSentenceIndex / total) * 100;

  if (progressBar) progressBar.style.width = `${progress}%`;
  if (segmentInfo) {
    segmentInfo.textContent = `Фраза ${Math.min(state.currentSentenceIndex + 1, total)} / ${total}`;
  }
}

function saveLessonProgress() {
  const state = window.lessonState;
  if (!state || !state.lesson) return;

  const progress = {
    lessonId: state.lesson.id,
    currentSentenceIndex: state.currentSentenceIndex,
    savedAt: new Date().toISOString()
  };

  localStorage.setItem(`da_progress_${state.lesson.id}`, JSON.stringify(progress));
}

function loadLessonProgress(lessonId) {
  try {
    const saved = localStorage.getItem(`da_progress_${lessonId}`);
    if (!saved) return null;
    return JSON.parse(saved);
  } catch (error) {
    console.error('Error loading progress:', error);
    return null;
  }
}

function restoreLessonProgress(lesson) {
  const saved = loadLessonProgress(lesson.id);
  if (!saved) return;

  if (typeof saved.currentSentenceIndex === 'number') {
    window.lessonState.currentSentenceIndex = Math.min(
      saved.currentSentenceIndex,
      lesson.sentences.length - 1
    );
    updateSentenceHighlight();
  }
}

function bindSentenceClicks() {
  document.addEventListener('click', (event) => {
    const sentenceEl = event.target.closest('.sentence');
    if (!sentenceEl) return;

    const state = window.lessonState;
    if (!state || !state.lesson) return;

    const index = Number(sentenceEl.dataset.index);
    if (Number.isNaN(index)) return;

    state.currentSentenceIndex = index;
    updateSentenceHighlight();

    if (typeof window.stopSpeech === 'function') {
      window.stopSpeech();
    }

    const playerStatus = document.getElementById('playerStatus');
    if (playerStatus) {
      playerStatus.textContent = `Выбрана фраза ${index + 1}`;
    }

    saveLessonProgress();
  });
}

function bindMarkDoneButton() {
  const markDoneBtn = document.getElementById('markDoneBtn');
  const state = window.lessonState;
  if (!markDoneBtn || !state || !state.lesson) return;

  const doneKey = `da_done_${state.lesson.id}`;
  const saved = localStorage.getItem(doneKey);

  if (saved === '1') {
    markDoneBtn.textContent = 'Пройдено';
  }

  markDoneBtn.addEventListener('click', () => {
    localStorage.setItem(doneKey, '1');
    markDoneBtn.textContent = 'Пройдено';
  });
}

async function initLessonPage() {
  const lessons = await loadLessons();
  if (!lessons.length) {
    console.error('No lessons found');
    return;
  }

  renderLessonNav(lessons);

  const lessonId = getLessonIdFromUrl();
  const lesson = lessons.find(item => item.id === lessonId) || lessons[0];

  renderLesson(lesson);
  restoreLessonProgress(lesson);
  bindMarkDoneButton();
  bindSentenceClicks();

  if (typeof window.updatePlayerUI === 'function') {
    window.updatePlayerUI();
  }
}

document.addEventListener('DOMContentLoaded', initLessonPage);

