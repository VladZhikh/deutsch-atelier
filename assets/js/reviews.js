// assets/js/reviews.js
const REVIEWS = [
  {
    id: 'review-001',
    displayName: 'Anna',
    rating: 5,
    comment: 'Очень удобный формат коротких уроков и хороший плеер по фразам.',
    language: 'ru',
    publishConsent: true,
    status: 'approved',
    createdAt: '2026-07-15T10:30:00Z',
    source: 'email'
  },
  {
    id: 'review-002',
    displayName: 'Maksym',
    rating: 5,
    comment: 'Мультиязычный интерфейс и запись голоса — отличная идея.',
    language: 'uk',
    publishConsent: true,
    status: 'approved',
    createdAt: '2026-07-15T11:00:00Z',
    source: 'email'
  },
  {
    id: 'review-003',
    displayName: 'Laura',
    rating: 4,
    comment: 'The lesson structure is clear and easy to follow.',
    language: 'en',
    publishConsent: true,
    status: 'approved',
    createdAt: '2026-07-15T12:00:00Z',
    source: 'email'
  }
];

function stars(n) {
  return '★'.repeat(n) + '☆'.repeat(5 - n);
}

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('reviewsList');
  if (!container) return;

  const approved = REVIEWS.filter(r => r.status === 'approved');
  container.innerHTML = approved.map(review => `
    <article class="review-card">
      <div class="review-top">
        <strong>${review.displayName}</strong>
        <span>${stars(review.rating)}</span>
      </div>
      <p>${review.comment}</p>
      <small>${review.language.toUpperCase()} · ${new Date(review.createdAt).toLocaleDateString()}</small>
    </article>
  `).join('');
});
