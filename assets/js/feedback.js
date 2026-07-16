// assets/js/feedback.js
const FEEDBACK_KEY = 'da_feedback_drafts';

function renderStars() {
  const container = document.getElementById('starRating');
  if (!container) return;

  let rating = 0;
  const saved = JSON.parse(localStorage.getItem(FEEDBACK_KEY) || '{}');
  if (saved.rating) rating = saved.rating;

  container.innerHTML = '';
  for (let i = 1; i <= 5; i++) {
    const star = document.createElement('span');
    star.className = 'star' + (i <= rating ? ' active' : '');
    star.textContent = '★';
    star.addEventListener('click', () => {
      rating = i;
      renderStars();
      saveDraft();
    });
    container.appendChild(star);
  }
}

function saveDraft() {
  const draft = {
    name: document.getElementById('feedbackName')?.value || '',
    language: document.getElementById('feedbackLanguage')?.value || 'ru',
    rating: [...document.querySelectorAll('#starRating .star.active')].length,
    comment: document.getElementById('feedbackComment')?.value || '',
    publishConsent: document.getElementById('publishConsent')?.checked || false
  };
  localStorage.setItem(FEEDBACK_KEY, JSON.stringify(draft));
}

function loadDraft() {
  const draft = JSON.parse(localStorage.getItem(FEEDBACK_KEY) || '{}');
  if (document.getElementById('feedbackName')) document.getElementById('feedbackName').value = draft.name || '';
  if (document.getElementById('feedbackLanguage')) document.getElementById('feedbackLanguage').value = draft.language || 'ru';
  if (document.getElementById('feedbackComment')) document.getElementById('feedbackComment').value = draft.comment || '';
  if (document.getElementById('publishConsent')) document.getElementById('publishConsent').checked = !!draft.publishConsent;
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('feedbackForm');
  const saveDraftBtn = document.getElementById('saveDraftBtn');
  const status = document.getElementById('feedbackStatus');

  if (!form) return;

  loadDraft();
  renderStars();

  ['feedbackName', 'feedbackLanguage', 'feedbackComment', 'publishConsent'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', saveDraft);
    if (el) el.addEventListener('change', saveDraft);
  });

  if (saveDraftBtn) {
    saveDraftBtn.addEventListener('click', saveDraft);
  }

  form.addEventListener('submit', e => {
    e.preventDefault();

    const name = document.getElementById('feedbackName').value.trim();
    const language = document.getElementById('feedbackLanguage').value;
    const rating = [...document.querySelectorAll('#starRating .star.active')].length;
    const comment = document.getElementById('feedbackComment').value.trim();
    const publishConsent = document.getElementById('publishConsent').checked;

    const review = {
      id: `review-${Date.now()}`,
      displayName: name || 'Anonymous',
      rating,
      comment,
      language,
      publishConsent,
      status: 'pending',
      createdAt: new Date().toISOString(),
      source: 'email'
    };

    localStorage.setItem('da_last_review', JSON.stringify(review));

    const subject = encodeURIComponent('Deutsch Atelier feedback');
    const body = encodeURIComponent(
      `Name: ${review.displayName}\nRating: ${review.rating}\nLanguage: ${review.language}\nConsent: ${review.publishConsent}\n\nComment:\n${review.comment}\n\nJSON:\n${JSON.stringify(review, null, 2)}`
    );

    window.location.href = `mailto:feedback@example.com?subject=${subject}&body=${body}`;
    status.textContent = 'Письмо подготовлено. Если почтовый клиент не открылся, проверьте настройки браузера.';
  });
});
