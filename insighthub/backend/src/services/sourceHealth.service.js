import logger from '../utils/logger.js';
import { emitSourceStatus } from '../websocket/handlers.js';

const RATE_LIMIT_HEADERS = [
  'x-ratelimit-remaining',
  'x-rate-limit-remaining',
  'ratelimit-remaining',
];

export function extractRateLimitRemaining(headers = {}) {
  for (const key of RATE_LIMIT_HEADERS) {
    const value = headers[key] ?? headers[key.toLowerCase()];
    if (value !== undefined && value !== null && value !== '') {
      const parsed = parseInt(value, 10);
      if (!Number.isNaN(parsed)) return parsed;
    }
  }
  return null;
}

export function classifyHttpError(error) {
  const status = error.response?.status;

  if (status === 429) {
    return { status: 'degraded', reason: 'rate_limited' };
  }
  if (status === 401 || status === 403) {
    return { status: 'down', reason: 'auth_failed' };
  }
  if (status >= 500) {
    return { status: 'degraded', reason: 'upstream_error' };
  }
  return { status: 'degraded', reason: error.message || 'fetch_failed' };
}

export async function recordFetchSuccess(source, { total, saved, merged, skipped, rateLimitRemaining }) {
  const duplicateCount = merged + skipped;
  const dedupRatio = total > 0 ? Number((duplicateCount / total).toFixed(4)) : source.dedupRatio;

  source.lastFetchedAt = new Date();
  source.status = 'active';
  source.lastError = '';
  source.articlesFetched += saved;
  source.dedupRatio = dedupRatio;

  if (rateLimitRemaining !== null && rateLimitRemaining !== undefined) {
    source.rateLimitRemaining = rateLimitRemaining;

    if (rateLimitRemaining <= 0) {
      source.status = 'degraded';
      source.lastError = 'Rate limit exhausted';
    } else if (rateLimitRemaining < 10) {
      source.status = 'degraded';
      source.lastError = `Rate limit low (${rateLimitRemaining} remaining)`;
    }
  }

  source.metadata = {
    ...source.metadata,
    lastFetchStats: { total, saved, merged, skipped, dedupRatio },
    lastSuccessAt: new Date().toISOString(),
  };

  await source.save();
  logger.info(`Source health updated: ${source.name}`, {
    status: source.status,
    dedupRatio,
    rateLimitRemaining: source.rateLimitRemaining,
  });

  emitSourceStatus(source);
}

export async function recordFetchFailure(source, error) {
  const classification = classifyHttpError(error);
  const rateLimitRemaining = extractRateLimitRemaining(error.response?.headers);

  source.status = classification.status;
  source.lastError = error.response?.data?.message || error.message || classification.reason;
  source.lastFetchedAt = new Date();

  if (rateLimitRemaining !== null) {
    source.rateLimitRemaining = rateLimitRemaining;
  }

  source.metadata = {
    ...source.metadata,
    lastFailureAt: new Date().toISOString(),
    lastFailureReason: classification.reason,
  };

  await source.save();
  logger.error(`Source health degraded: ${source.name}`, {
    status: source.status,
    reason: source.lastError,
  });

  emitSourceStatus(source);
}

export async function getSourceHealthSummary() {
  const Source = (await import('../models/Source.js')).default;
  const sources = await Source.find().sort({ name: 1 }).lean();

  return sources.map((source) => ({
    slug: source.slug,
    name: source.name,
    status: source.status,
    lastFetchedAt: source.lastFetchedAt,
    rateLimitRemaining: source.rateLimitRemaining,
    dedupRatio: source.dedupRatio,
    articlesFetched: source.articlesFetched,
    lastError: source.lastError,
  }));
}

export default {
  extractRateLimitRemaining,
  classifyHttpError,
  recordFetchSuccess,
  recordFetchFailure,
  getSourceHealthSummary,
};
