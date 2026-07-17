
document.addEventListener('DOMContentLoaded', () => {
  const markDoneBtn = document.getElementById('markDoneBtn');
        
  
  markDoneBtn.addEventListener('click', () => {
    console.log('Кнопка бала нажата')
    //ocalStorage.setItem(key, '1');
    markDoneBtn.textContent = 'Пройлено';
  });
});


const textarea = document.getElementById('retellText');
const button = document.getElementById('checkKeywordsBtn'); 
 
button.addEventListener('click', () => {
  // Получаем актуальный текст из textarea
  const text = textarea.value;
  
  // Выводим результат в консоль браузера
  console.log('Текст из поля:', text);
});

function normalizeText(text) {
  return (text || '')
    .toLowerCase()
    .replace(/[.,!?;:()"«»„“'’\-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function getLessonKeywords() {
  const lesson = window.lessonState && window.lessonState.lesson;
  if (!lesson) return [];

  // Если в уроке есть отдельный массив keywords
  if (Array.isArray(lesson.keywords) && lesson.keywords.length > 0) {
    return lesson.keywords;
  }

  // Если keywords нет, берём немецкие слова из vocabulary
  if (Array.isArray(lesson.vocabulary)) {
    return lesson.vocabulary
      .map(item => {
        if (typeof item === 'string') return item;
        return item.de || item.word || '';
      })
      .filter(Boolean);
  }

  return [];
}

function checkKeywords() {
  const textArea = document.getElementById('retellText');
  const resultBox = document.getElementById('keywordResult');

  //if (!textArea || !resultBox) return;

  const text = normalizeText(textArea.value);
  const keywords = getLessonKeywords().map(normalizeText).filter(Boolean);

  if (keywords.length === 0) {
    resultBox.textContent = 'Для этого урока не заданы ключевые слова.';
    return;
 }

  const found = [];
  const missing = [];

  keywords.forEach(keyword => {
    if (text.includes(keyword)) {
      found.push(keyword);
    } else {
      missing.push(keyword);
    }
  });

  const percent = Math.round((found.length / keywords.length) * 100);

  resultBox.innerHTML = `Key-word match: ${percent}%`;
}
const checkBtn = document.getElementById('checkKeywordsBtn');
  if (checkBtn) {
    checkBtn.addEventListener('click', checkKeywords);
  }
