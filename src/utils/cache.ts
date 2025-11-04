/**
 * 🧠 Simple in-memory cache for tool results.
 * Keyed by query text. Automatically expires entries.
 */

interface CacheEntry {
  value: string;
  expiresAt: number;
}

const cache = new Map<string, CacheEntry>();

// ⏱ 5 minutes by default
const DEFAULT_TTL_MS = 5 * 60 * 1000;

export function getFromCache(key: string): string | null {
  const entry = cache.get(key);
  if (!entry) return null;

  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return null;
  }

  return entry.value;
}

export function setToCache(
  key: string,
  value: string,
  ttl = DEFAULT_TTL_MS
): void {
  cache.set(key, { value, expiresAt: Date.now() + ttl });
}

export function clearCache(): void {
  cache.clear();
}
