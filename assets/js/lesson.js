// assets/js/lesson.js
const LESSONS = [
  {
    id: 'b1-01',
    level: 'B1',
    topic: 'Beruf',
    title: 'Работа и баланс',
    description: 'Короткий урок о новой работе, планировании дня и балансе между делами и личной жизнью.',
    sentences: [
      'Seit drei Monaten arbeite ich in einer neuen Firma.',
      'Am Anfang war alles ziemlich stressig.',
      'Inzwischen fühle ich mich sicherer.',
      'Jetzt plane ich meinen Tag realistischer.',
      'So habe ich am Abend mehr Zeit für Sport und Freunde.'
    ],
    vocabulary: [
      { de: 'die Firma', ru: 'компания' },
      { de: 'ziemlich stressig', ru: ' - довольно напряжённо' },
      { de: 'sich sicherer fühlen', ru: ' - чувствовать себя увереннее' },
      { de: 'realistischer planen', ru: ' - планировать реалистичнее' }
    ],
    questions: [
      'Warum war der Anfang schwierig?',
      'Warum fühlt sich die Person jetzt sicherer?',
      'Was hat sich am Tagesablauf verändert?'
    ]
  },
  {
    id: 'b1-02',
    level: 'B1',
    topic: 'Wohnen',
    title: 'Поиск квартиры',
    description: 'Урок о поиске квартиры, осмотре и выборе между ценой и расположением.',
    sentences: [
      'Meine Schwester sucht seit Wochen eine Wohnung in der Innenstadt.',
      'Viele Angebote sind zu teuer oder zu klein.',
      'Letzte Woche hat sie eine helle Zweizimmerwohnung besichtigt.',
      'Die Lage war sehr gut, aber die Miete war höher als geplant.',
      'Jetzt überlegt sie, ob sie lieber etwas außerhalb wohnen soll.'
    ],
    vocabulary: [
      { de: 'die Wohnung', ru: ' - квартира' },
      { de: 'besichtigen', ru: ' - осматривать' },
      { de: 'die Lage', ru: ' - расположение' },
      { de: 'die Miete', ru: ' - арендная плата' }
    ],
    questions: [
      'Was sucht die Schwester?',
      'Was war gut an der Wohnung?',
      'Warum hat sie sich noch nicht entschieden?'
    ]
  },
  {
    id: 'b2-01',
    level: 'B2',
    topic: 'Meinung',
    title: 'Мнение о технологиях',
    description: 'Более сложный текст о преимуществах и недостатках цифровых привычек.',
    sentences: [
      'Digitale Geräte erleichtern unseren Alltag, aber sie können auch ablenken.',
      'Viele Menschen verbringen zu viel Zeit am Bildschirm.',
      'Trotzdem sind Online-Tools im Beruf und im Studium sehr nützlich.',
      'Entscheidend ist, dass man bewusst mit Technik umgeht.',
      'Nur so bleibt sie ein hilfreiches Werkzeug.'
    ],
    vocabulary: [
      { de: 'ablenken', ru: ' - отвлекать' },
      { de: 'nützlich', ru: ' - полезный' },
      { de: 'bewusst', ru: ' - осознанно' },
      { de: 'das Werkzeug', ru: ' - инструмент' }
    ],
    questions: [
      'Welche Vorteile haben digitale Geräte?',
      'Was ist das Problem?',
      'Welche Haltung wird empfohlen?'
    ]
  }
];

function getLessonId() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id') || 'b1-01';
}

function renderLessonNav() {
  const nav = document.getElementById('lessonNav');
  if (!nav) return;
  nav.innerHTML = LESSONS.map(lesson => `
    <a href="lesson.html?id=${lesson.id}">${lesson.level} · ${lesson.title}</a>
  `).join('');
}

function renderLesson(lesson) {
  document.getElementById('lessonMeta').textContent = `${lesson.level} · ${lesson.topic}`;
  document.getElementById('lessonTitle').textContent = lesson.title;
  document.getElementById('lessonDescription').textContent = lesson.description;

  const sentenceStrip = document.getElementById('sentenceStrip');
  sentenceStrip.innerHTML = lesson.sentences.map((sentence, index) => `
    <div class="sentence" data-index="${index}">${sentence}</div>
  `).join('');

  document.getElementById('vocabList').innerHTML = lesson.vocabulary.map(item => `
    <li><span>${item.de}</span><span>${item.ru}</span></li>
  `).join('');

  document.getElementById('questionList').innerHTML = lesson.questions.map(q => `
    <div class="question-item">${q}</div>
  `).join('');

  window.currentLesson = lesson;
  window.currentSentenceIndex = 0;
  window.lessonProgress = {
    lessonId: lesson.id,
    currentIndex: 0,
    slowMode: false,
    shadowMode: false
  };

  if (window.updatePlayerUI) window.updatePlayerUI();
}

document.addEventListener('DOMContentLoaded', () => {
  renderLessonNav();
  const lesson = LESSONS.find(item => item.id === getLessonId()) || LESSONS[0];
  renderLesson(lesson);
});
