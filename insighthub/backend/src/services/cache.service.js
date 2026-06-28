import { isRedisAvailable, getRedis } from '../config/redis.js';
import { env } from '../config/env.js';
import logger from '../utils/logger.js';

export async function cacheGet(key) {
  if (!isRedisAvailable()) return null;
  try {
    const raw = await getRedis().get(key);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    logger.warn('Cache get failed', { key, error: error.message });
    return null;
  }
}

export async function cacheSet(key, value, ttlSeconds = env.cacheTtlSeconds) {
  if (!isRedisAvailable()) return false;
  try {
    await getRedis().set(key, JSON.stringify(value), 'EX', ttlSeconds);
    return true;
  } catch (error) {
    logger.warn('Cache set failed', { key, error: error.message });
    return false;
  }
}

export async function cacheDeletePattern(pattern) {
  if (!isRedisAvailable()) return;
  try {
    const client = getRedis();
    let cursor = '0';
    do {
      const [nextCursor, keys] = await client.scan(cursor, 'MATCH', pattern, 'COUNT', 100);
      cursor = nextCursor;
      if (keys.length > 0) await client.del(...keys);
    } while (cursor !== '0');
  } catch (error) {
    logger.warn('Cache delete pattern failed', { pattern, error: error.message });
  }
}

export async function invalidateFeedCaches() {
  await Promise.all([
    cacheDeletePattern('trending:*'),
    cacheDeletePattern('analytics:*'),
    cacheDeletePattern('news:*'),
    cacheDeletePattern('local:*'),
    cacheDeletePattern('brief:*'),
    cacheDeletePattern('search:*'),
  ]);
  logger.debug('Feed caches invalidated');
}

export function buildCacheKey(prefix, params) {
  const sorted = Object.keys(params)
    .sort()
    .map((k) => `${k}=${params[k] ?? ''}`)
    .join('&');
  return `${prefix}:${sorted}`;
}

export default { cacheGet, cacheSet, cacheDeletePattern, invalidateFeedCaches, buildCacheKey };
