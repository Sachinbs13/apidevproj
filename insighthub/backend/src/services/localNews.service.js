import Article from '../models/Article.js';
import { cacheGet, cacheSet, buildCacheKey } from './cache.service.js';
import { env } from '../config/env.js';

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export async function getLocalNewsArticles({ state, city, page = 1, limit = 20 }) {
  const normalizedState = state?.trim();
  const normalizedCity = city?.trim() || '';

  if (!normalizedState || normalizedState === 'National') {
    return {
      articles: [],
      pagination: {
        page,
        limit,
        total: 0,
        totalPages: 0,
        hasNext: false,
        hasPrev: false,
      },
    };
  }

  const cacheKey = buildCacheKey('local', {
    state: normalizedState,
    city: normalizedCity,
    page,
    limit,
  });

  const cached = await cacheGet(cacheKey);
  if (cached) return cached;

  const skip = (page - 1) * limit;
  const filter = { 'regionalInfo.state': normalizedState };

  if (normalizedCity) {
    const cityRegex = new RegExp(`^${escapeRegex(normalizedCity)}$`, 'i');
    filter.$or = [
      { 'regionalInfo.city': cityRegex },
      { 'regionalInfo.district': cityRegex },
    ];
  }

  const [articles, total] = await Promise.all([
    Article.find(filter)
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('sources.sourceId', 'name slug type status')
      .lean(),
    Article.countDocuments(filter),
  ]);

  const result = {
    articles,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1,
    },
  };

  await cacheSet(cacheKey, result, env.cacheTtlSeconds);
  return result;
}

export default { getLocalNewsArticles };
