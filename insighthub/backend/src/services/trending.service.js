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

export async function getTrendingTopics({
  limit = 8,
  windowHours = env.trendingWindowHours,
} = {}) {
  const cacheKey = buildCacheKey('trending', { type: 'topics', limit, windowHours });
  const cached = await cacheGet(cacheKey);
  if (cached) return cached;

  const articles = await getTrendingArticles({ limit: 50, windowHours });
  const counts = {};

  articles.forEach((article) => {
    const topic = (article.category || 'general').toLowerCase();
    counts[topic] = (counts[topic] || 0) + 1;
  });

  const topics = Object.entries(counts)
    .map(([topic, count]) => ({ topic, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);

  await cacheSet(cacheKey, topics, env.cacheTtlSeconds);
  return topics;
}

export async function getMostReadArticles({ limit = 10 } = {}) {
  const cacheKey = buildCacheKey('trending', { type: 'mostread', limit });
  const cached = await cacheGet(cacheKey);
  if (cached) return cached;

  const User = (await import('../models/User.js')).default;
  const Article = (await import('../models/Article.js')).default;

  const aggregated = await User.aggregate([
    { $match: { 'library.readingHistory.0': { $exists: true } } },
    { $unwind: '$library.readingHistory' },
    { $group: { _id: '$library.readingHistory.articleId', views: { $sum: 1 } } },
    { $sort: { views: -1 } },
    { $limit: limit },
  ]);

  if (aggregated.length === 0) {
    const fallback = await getTrendingArticles({ limit });
    const result = fallback.map((article) => ({ ...article, viewCount: 0 }));
    await cacheSet(cacheKey, result, env.cacheTtlSeconds);
    return result;
  }

  const articleIds = aggregated.map((entry) => entry._id);
  const articles = await Article.find({ _id: { $in: articleIds } })
    .populate('sources.sourceId', 'name slug type status')
    .lean();

  const viewMap = new Map(aggregated.map((entry) => [entry._id.toString(), entry.views]));
  const result = articles
    .map((article) => ({
      ...article,
      viewCount: viewMap.get(article._id.toString()) || 0,
    }))
    .sort((a, b) => b.viewCount - a.viewCount);

  await cacheSet(cacheKey, result, env.cacheTtlSeconds);
  return result;
}

export default { getTrendingScore, getTrendingArticles, getTrendingTopics, getMostReadArticles };
