import { api } from '@/lib/axios';
import { getDataWithRetry } from '@/lib/apiRetry';
import type { Quiz } from '@/types/quiz';

/**
 * Lấy quiz ngẫu nhiên từ hệ thống
 */
export async function getRandomQuiz(): Promise<Quiz> {
  return getDataWithRetry<Quiz>(
    () => api.get<Quiz>('/quiz/random'),
    (d) => !!d && Array.isArray(d.questions) && d.questions.length > 0,
    { maxAttempts: 6, initialDelayMs: 400 },
  );
}

/**
 * Lấy quiz theo ID
 */
export async function getQuizById(quizId: string): Promise<Quiz> {
  return getDataWithRetry<Quiz>(
    () => api.get<Quiz>(`/quiz/${quizId}`),
    (d) => !!d && Array.isArray(d.questions) && d.questions.length > 0,
    { maxAttempts: 6, initialDelayMs: 400 },
  );
}

/**
 * Lấy quiz ngẫu nhiên theo level
 */
export async function getRandomQuizByLevel(levelId: string): Promise<Quiz> {
  return getDataWithRetry<Quiz>(
    () => api.get<Quiz>(`/quiz/level/${levelId}/random`),
    (d) => !!d && Array.isArray(d.questions) && d.questions.length > 0,
    { maxAttempts: 6, initialDelayMs: 400 },
  );
}
