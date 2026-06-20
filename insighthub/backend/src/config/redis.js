import Redis from 'ioredis';
import { env } from './env.js';
import logger from '../utils/logger.js';

let redis = null;
let redisAvailable = false;

export async function connectRedis() {
  if (!env.redisEnabled) {
    logger.info('Redis caching disabled');
    return null;
  }

  try {
    redis = new Redis(env.redisUrl, {
      maxRetriesPerRequest: 3,
      retryStrategy: (times) => (times > 3 ? null : Math.min(times * 200, 2000)),
    });

    await redis.ping();
    redisAvailable = true;
    logger.info('Redis connected');

    redis.on('error', (err) => {
      logger.warn('Redis error', { error: err.message });
      redisAvailable = false;
    });

    redis.on('ready', () => {
      redisAvailable = true;
    });

    return redis;
  } catch (error) {
    logger.warn('Redis unavailable — running without cache', { error: error.message });
    if (redis) redis.disconnect();
    redis = null;
    redisAvailable = false;
    return null;
  }
}

export function getRedis() {
  return redis;
}

export function isRedisAvailable() {
  return redisAvailable && redis?.status === 'ready';
}

export async function disconnectRedis() {
  if (redis) {
    redis.disconnect();
    redis = null;
    redisAvailable = false;
  }
}

export default { connectRedis, getRedis, isRedisAvailable, disconnectRedis };
