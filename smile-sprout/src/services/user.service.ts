import { api } from '@/lib/axios';

/**
 * Lấy thông tin profile user hiện tại
 */
export async function getUserProfile(userId: string) {
  const res = await api.get(`/users/${userId}`);
  return res.data;
}

/**
 * Cập nhật thông tin profile user
 */
export async function updateUserProfile(
  userId: string,
  data: { name?: string; birthDate?: string; avatarUrl?: string | null },
) {
  const res = await api.patch(`/users/${userId}`, data);
  return res.data;
}
