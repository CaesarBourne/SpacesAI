/**
 * 🧠 Simple in-memory cache for tool results.
 * Keyed by query text. Automatically expires entries.
 */
const cache = new Map();
// ⏱ 5 minutes by default
const DEFAULT_TTL_MS = 5 * 60 * 1000;
export function getFromCache(key) {
    const entry = cache.get(key);
    if (!entry)
        return null;
    if (Date.now() > entry.expiresAt) {
        cache.delete(key);
        return null;
    }
    return entry.value;
}
export function setToCache(key, value, ttl = DEFAULT_TTL_MS) {
    cache.set(key, { value, expiresAt: Date.now() + ttl });
}
export function clearCache() {
    cache.clear();
}
