export const speakText = (text: string) => {
  if (!('speechSynthesis' in window)) {
    console.warn('Text-to-speech not supported.');
    return;
  }

  window.speechSynthesis.cancel(); // Stop current speech

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'vi-VN';
  utterance.rate = 0.9; // Slightly slower for kids
  utterance.pitch = 1.1; // Slightly higher pitch for friendlier tone

  const voices = window.speechSynthesis.getVoices();
  // Try to find a premium Vietnamese voice
  const viVoice = 
    voices.find(v => v.name.includes('Google') && v.lang.includes('vi')) ||
    voices.find(v => v.lang === 'vi-VN' || v.lang.includes('vi'));

  if (viVoice) {
    utterance.voice = viVoice;
  }

  window.speechSynthesis.speak(utterance);
};
