import { api } from '@/lib/axios';
import { getDataWithRetry } from '@/lib/apiRetry';
import type { Level } from '@/types/level';
import type { Quiz } from '@/types/quiz';

/**
 * Lấy danh sách tất cả levels (kèm trạng thái unlock)
 */
export async function getAllLevels(): Promise<Level[]> {
  return getDataWithRetry<Level[]>(
    () => api.get<Level[]>('/levels'),
    (d) => Array.isArray(d) && d.length > 0,
    { maxAttempts: 6, initialDelayMs: 400 },
  );
}

/**
 * Lấy danh sách quiz trong 1 level
 */
export async function getQuizzesByLevelId(levelId: string): Promise<Quiz[]> {
  return getDataWithRetry<Quiz[]>(
    () => api.get<Quiz[]>(`/levels/${levelId}`),
    (d) => Array.isArray(d) && d.length > 0,
    { maxAttempts: 6, initialDelayMs: 400 },
  );
}
