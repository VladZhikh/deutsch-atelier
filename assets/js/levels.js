// assets/js/levels.js
const LEVELS_DATA = [
  {
    level: 'B1',
    lessons: [
      { id: 'b1-01', title: 'Работа и баланс', topic: 'Beruf' },
      { id: 'b1-02', title: 'Поиск квартиры', topic: 'Wohnen' },
      { id: 'b1-03', title: 'Поездка на выходных', topic: 'Reisen' }
    ]
  },
  {
    level: 'B2',
    lessons: [
      { id: 'b2-01', title: 'Мнение о технологиях', topic: 'Meinung' },
      { id: 'b2-02', title: 'Учёба и планы', topic: 'Studium' }
    ]
  }
];

function renderLessons(containerId, lessons) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = lessons.map(lesson => `
    <a class="lesson-card" href="lesson.html?id=${lesson.id}">
      <span class="level-tag">${lesson.topic}</span>
      <h3>${lesson.title}</h3>
      <p>${lesson.id}</p>
    </a>
  `).join('');
}

document.addEventListener('DOMContentLoaded', () => {
  renderLessons('b1Lessons', LEVELS_DATA[0].lessons);
  renderLessons('b2Lessons', LEVELS_DATA[1].lessons);
});
