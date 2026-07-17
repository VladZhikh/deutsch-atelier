async function loadJson(path) {
  try {
    const response = await fetch(path);
    if (!response.ok) {
      throw new Error(`Failed to load ${path}: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

function renderLessonCards(containerId, lessons) {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (!lessons.length) {
    container.innerHTML = `
      <div class="lesson-card">
        <h3>Пока нет уроков</h3>
        <p>Этот раздел будет заполнен позже.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = lessons.map(lesson => `
    <a class="lesson-card" href="lesson.html?id=${lesson.id}">
      <span class="level-tag">${lesson.topic || lesson.level}</span>
      <h3>${lesson.title}</h3>
      <p>${lesson.description || lesson.id}</p>
    </a>
  `).join('');
}

function groupLessonsByLevel(lessons) {
  return lessons.reduce((acc, lesson) => {
    const level = (lesson.level || '').toUpperCase();
    if (!acc[level]) acc[level] = [];
    acc[level].push(lesson);
    return acc;
  }, {});
}

function updateLevelHeadings(levels) {
  const b1Title = document.querySelector('#b1 h2');
  const b2Title = document.querySelector('#b2 h2');

  const b1 = levels.find(level => level.level === 'B1');
  const b2 = levels.find(level => level.level === 'B2');

  if (b1Title && b1?.title) b1Title.textContent = b1.title;
  if (b2Title && b2?.title) b2Title.textContent = b2.title;
}

async function initLevelsPage() {
  const [levels, lessons] = await Promise.all([
    loadJson('data/levels.json'),
    loadJson('data/lessons.json')
  ]);

  updateLevelHeadings(levels);

  const grouped = groupLessonsByLevel(lessons);

  renderLessonCards('b1Lessons', grouped.B1 || []);
  renderLessonCards('b2Lessons', grouped.B2 || []);
}

document.addEventListener('DOMContentLoaded', initLevelsPage);