/**
 * Lightweight retry helper for API calls that may return null/empty payloads.
 * It will attempt the provided request until `validate(data)` returns true,
 * or until maxAttempts is reached. Uses exponential backoff between attempts.
 */
export async function getDataWithRetry<T>(
  request: () => Promise<{ data: T }>,
  validate: (data: T) => boolean,
  options?: { maxAttempts?: number; initialDelayMs?: number }
): Promise<T> {
  const maxAttempts = options?.maxAttempts ?? 8; // reasonable default
  const initialDelayMs = options?.initialDelayMs ?? 500;

  let attempt = 0;
  while (true) {
    attempt += 1;
    try {
      const res = await request();
      const data = res.data;
      if (validate(data)) return data;
      // otherwise fallthrough to retry
    } catch (err) {
      // swallow and retry up to limit
      // eslint-disable-next-line no-console
      console.warn("API request error (will retry):", err);
    }

    if (attempt >= maxAttempts) {
      throw new Error(`No valid data after ${attempt} attempts`);
    }

    const delay = initialDelayMs * Math.pow(2, attempt - 1);
    // eslint-disable-next-line no-await-in-loop
    await new Promise((r) => setTimeout(r, delay));
  }
}
