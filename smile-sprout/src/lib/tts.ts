export const speakText = (text: string) => {
  if (!text) return;
  
  // Cut text to 200 chars max if needed (Google TTS limit)
  const safeText = text.substring(0, 199);
  
  // Try Google Translate TTS for a much more natural voice
  const url = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=vi&q=${encodeURIComponent(safeText)}`;
  const audio = new Audio(url);
  
  audio.play().catch((err) => {
    console.warn('Google TTS failed, falling back to Web Speech API', err);
    fallbackSpeechSynthesis(safeText);
  });
};

const fallbackSpeechSynthesis = (text: string) => {
  if (!('speechSynthesis' in window)) return;

  window.speechSynthesis.cancel(); // Stop current speech

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'vi-VN';
  utterance.rate = 0.9;
  utterance.pitch = 1.1;

  const voices = window.speechSynthesis.getVoices();
  const viVoice = 
    voices.find(v => v.name.includes('Google') && v.lang.includes('vi')) ||
    voices.find(v => v.lang === 'vi-VN' || v.lang.includes('vi'));

  if (viVoice) {
    utterance.voice = viVoice;
  }

  window.speechSynthesis.speak(utterance);
};
