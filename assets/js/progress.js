// assets/js/progress.js
document.addEventListener('DOMContentLoaded', () => {
  const markDoneBtn = document.getElementById('markDoneBtn');
  if (!markDoneBtn || !window.currentLesson) return;

  const key = `da_done_${window.currentLesson.id}`;
  const saved = localStorage.getItem(key);

  if (saved === '1') {
    markDoneBtn.textContent = 'Пройдено';
  }

  markDoneBtn.addEventListener('click', () => {
    localStorage.setItem(key, '1');
    markDoneBtn.textContent = 'Пройдено';
  });

  const retellInput = document.getElementById('retellInput');
  const saveRetellBtn = document.getElementById('saveRetellBtn');
  const checkRetellBtn = document.getElementById('checkRetellBtn');
  const retellFeedback = document.getElementById('retellFeedback');

  if (retellInput) {
    const savedText = localStorage.getItem(`da_retell_${window.currentLesson.id}`) || '';
    retellInput.value = savedText;
  }

  if (saveRetellBtn && retellInput) {
    saveRetellBtn.addEventListener('click', () => {
      localStorage.setItem(`da_retell_${window.currentLesson.id}`, retellInput.value);
      retellFeedback.textContent = 'Заметки сохранены.';
    });
  }

  if (checkRetellBtn && retellInput) {
    checkRetellBtn.addEventListener('click', () => {
      const source = window.currentLesson.sentences.join(' ').toLowerCase();
      const user = retellInput.value.toLowerCase();
      const words = [...new Set(source.split(' ').filter(w => w.length > 4))];
      const matched = words.filter(word => user.includes(word));
      const percent = Math.round((matched.length / words.length) * 100);
      retellFeedback.textContent = `Совпадение по ключевым словам: ${percent}%`;
    });
  }
});
