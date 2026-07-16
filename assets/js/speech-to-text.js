// assets/js/speech-to-text.js
document.addEventListener('DOMContentLoaded', () => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const sttStartBtn = document.getElementById('sttStartBtn');
  const sttStopBtn = document.getElementById('sttStopBtn');
  const sttStatus = document.getElementById('sttStatus');
  const sttOutput = document.getElementById('sttOutput');

  if (!sttStartBtn || !sttStopBtn || !sttStatus || !sttOutput) return;

  if (!SpeechRecognition) {
    sttStatus.textContent = 'Speech-to-Text is not supported in this browser.';
    sttStartBtn.disabled = true;
    sttStopBtn.disabled = true;
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = 'de-DE';
  recognition.interimResults = true;
  recognition.continuous = true;

  recognition.onstart = () => {
    sttStatus.textContent = 'Speech-to-Text active.';
    sttStartBtn.disabled = true;
    sttStopBtn.disabled = false;
  };

  recognition.onresult = event => {
    let transcript = '';
    for (let i = 0; i < event.results.length; i++) {
      transcript += event.results[i][0].transcript + ' ';
    }
    sttOutput.value = transcript.trim();
  };

  recognition.onerror = () => {
    sttStatus.textContent = 'Speech recognition error.';
  };

  recognition.onend = () => {
    sttStatus.textContent = 'Speech-to-Text stopped.';
    sttStartBtn.disabled = false;
    sttStopBtn.disabled = true;
  };

  sttStartBtn.addEventListener('click', () => recognition.start());
  sttStopBtn.addEventListener('click', () => recognition.stop());
});
