import { useCallback, useRef } from 'react';
import { useSettings } from '../contexts/SettingsContext';

/**
 * Tạo âm thanh bằng Web Audio API — không cần file mp3.
 * Các âm thanh sinh ra hoàn toàn bằng code, nhẹ và instant.
 */
export function useSound() {
  const { settings } = useSettings();
  const ctxRef = useRef<AudioContext | null>(null);

  const getCtx = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = new AudioContext();
    }
    return ctxRef.current;
  }, []);

  const playTone = useCallback(
    (frequency: number, duration: number, type: OscillatorType = 'sine') => {
      if (settings.reducedMotion) return; // tắt âm thanh trong calm mode
      const vol = settings.volume / 100;
      if (vol <= 0) return;

      const ctx = getCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);
      gain.gain.setValueAtTime(vol * 0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + duration);
    },
    [getCtx, settings.volume, settings.reducedMotion]
  );

  /** 🎉 Trả lời đúng — melody vui vẻ */
  const playCorrect = useCallback(() => {
    playTone(523, 0.15, 'sine'); // C5
    setTimeout(() => playTone(659, 0.15, 'sine'), 100); // E5
    setTimeout(() => playTone(784, 0.25, 'sine'), 200); // G5
  }, [playTone]);

  /** 💪 Trả lời sai — tone nhẹ nhàng, không đáng sợ */
  const playWrong = useCallback(() => {
    playTone(330, 0.2, 'triangle'); // E4 — soft
    setTimeout(() => playTone(294, 0.25, 'triangle'), 150); // D4
  }, [playTone]);

  /** 🏆 Hoàn thành quiz — fanfare */
  const playComplete = useCallback(() => {
    playTone(523, 0.12, 'sine');
    setTimeout(() => playTone(659, 0.12, 'sine'), 100);
    setTimeout(() => playTone(784, 0.12, 'sine'), 200);
    setTimeout(() => playTone(1047, 0.3, 'sine'), 300);
  }, [playTone]);

  /** ⭐ Nhận sticker — ting sáng */
  const playSticker = useCallback(() => {
    playTone(880, 0.1, 'sine'); // A5
    setTimeout(() => playTone(1175, 0.15, 'sine'), 80); // D6
    setTimeout(() => playTone(1397, 0.25, 'sine'), 160); // F6
  }, [playTone]);

  /** 👆 Click nút — subtle */
  const playClick = useCallback(() => {
    playTone(600, 0.05, 'sine');
  }, [playTone]);

  return { playCorrect, playWrong, playComplete, playSticker, playClick };
}
