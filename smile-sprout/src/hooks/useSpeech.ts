import { useCallback, useRef } from 'react';
import { useSettings } from '../contexts/SettingsContext';

/**
 * Hook sử dụng Web Speech API để đọc text bằng giọng nói tiếng Việt.
 * Tự động đọc chậm hơn bình thường (rate 0.85) — phù hợp cho trẻ tự kỷ.
 * Tôn trọng cài đặt volume và autoReadAloud từ SettingsContext.
 */
export function useSpeech() {
  const { settings } = useSettings();
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const speak = useCallback(
    (text: string) => {
      if (!('speechSynthesis' in window)) return;

      // Dừng giọng nói đang phát (nếu có)
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = settings.language === 'vi' ? 'vi-VN' : 'en-US';
      utterance.rate = 0.85; // Chậm hơn bình thường
      utterance.pitch = 1.1; // Hơi cao — thân thiện với trẻ
      utterance.volume = settings.volume / 100;

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    },
    [settings.language, settings.volume]
  );

  const stop = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }, []);

  /** Đọc tự động nếu setting autoReadAloud = true */
  const autoSpeak = useCallback(
    (text: string) => {
      if (settings.autoReadAloud) {
        speak(text);
      }
    },
    [settings.autoReadAloud, speak]
  );

  return { speak, stop, autoSpeak };
}
