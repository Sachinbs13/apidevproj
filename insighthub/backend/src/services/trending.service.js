import { env } from '../config/env.js';
import { cacheGet, cacheSet, buildCacheKey } from './cache.service.js';

export function getTrendingScore(article, windowHours = env.trendingWindowHours) {
  const sourceCount = article.sources?.length || 1;
  const hoursAgo = (Date.now() - new Date(article.publishedAt).getTime()) / (1000 * 60 * 60);
  const recencyScore = Math.max(0, 1 - hoursAgo / windowHours);
  return Number((sourceCount * 3 + recencyScore * 10).toFixed(4));
}

async function computeTrendingArticles({ limit, windowHours }) {
  const Article = (await import('../models/Article.js')).default;
  const since = new Date(Date.now() - windowHours * 60 * 60 * 1000);

  const articles = await Article.find({ publishedAt: { $gte: since } })
    .populate('sources.sourceId', 'name slug type status')
    .lean();

  return articles
    .map((article) => ({
      ...article,
      trendingScore: getTrendingScore(article, windowHours),
    }))
    .sort((a, b) => b.trendingScore - a.trendingScore)
    .slice(0, limit);
}

export async function getTrendingArticles({
  limit = 20,
  windowHours = env.trendingWindowHours,
} = {}) {
  const cacheKey = buildCacheKey('trending', { limit, windowHours });
  const cached = await cacheGet(cacheKey);
  if (cached) return cached;

  const articles = await computeTrendingArticles({ limit, windowHours });
  await cacheSet(cacheKey, articles, env.cacheTtlSeconds);
  return articles;
}

export default { getTrendingScore, getTrendingArticles };
