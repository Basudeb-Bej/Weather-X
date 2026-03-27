const cache = new Map();
const DEFAULT_TTL = 10 * 60 * 1000;

function getCacheKey(prefix, payload) {
  return `${prefix}:${JSON.stringify(payload)}`;
}

function getCachedValue(key) {
  const entry = cache.get(key);

  if (!entry) {
    return null;
  }

  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return null;
  }

  return entry.value;
}

function setCachedValue(key, value, ttl = DEFAULT_TTL) {
  cache.set(key, {
    value,
    expiresAt: Date.now() + ttl,
  });
}

function cleanupCache() {
  const now = Date.now();

  for (const [key, entry] of cache.entries()) {
    if (now > entry.expiresAt) {
      cache.delete(key);
    }
  }
}

setInterval(cleanupCache, DEFAULT_TTL).unref();

module.exports = {
  getCacheKey,
  getCachedValue,
  setCachedValue,
};