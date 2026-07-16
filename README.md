# README.md

## Deutsch Atelier

Open-access static website for German B1/B2 lessons.

### Structure
- `index.html`
- `levels.html`
- `lesson.html`
- `feedback.html`
- `reviews.html`
- `about.html`
- `contact.html`

### Assets
- `assets/css/style.css`
- `assets/js/app.js`
- `assets/js/levels.js`
- `assets/js/lesson.js`
- `assets/js/player.js`
- `assets/js/recorder.js`
- `assets/js/speech-to-text.js`
- `assets/js/progress.js`
- `assets/js/feedback.js`
- `assets/js/reviews.js`

### Data
- `data/lessons.json`
- `data/levels.json`
- `data/reviews.json`
- `data/ui.ru.json`
- `data/ui.uk.json`
- `data/ui.en.json`
- `data/ui.es.json`

### Notes
- Fully client-side
- Language preference stored in `localStorage`
- Progress stored in `localStorage`
- Feedback can be sent via `mailto:` and later published manually from `reviews.json`
- Public reviews page shows only approved reviews
- SpeechRecognition is optional and browser-dependent
