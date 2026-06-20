import Article from '../models/Article.js';
import Source from '../models/Source.js';
import { cacheGet, cacheSet } from './cache.service.js';
import { env } from '../config/env.js';

async function computeAnalytics() {
  const [totalArticles, categoryBreakdown, sourceStats, multiSourceArticles, sentimentBreakdown] =
    await Promise.all([
      Article.countDocuments(),
      Article.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $project: { category: '$_id', count: 1, _id: 0 } },
      ]),
      Source.find()
        .select('name slug status dedupRatio articlesFetched rateLimitRemaining lastFetchedAt')
        .lean(),
      Article.countDocuments({ $expr: { $gt: [{ $size: '$sources' }, 1] } }),
      Article.aggregate([
        { $group: { _id: '$sentiment.label', count: { $sum: 1 } } },
        { $project: { label: '$_id', count: 1, _id: 0 } },
      ]),
    ]);

  const avgDedupRatio =
    sourceStats.length > 0
      ? Number(
          (sourceStats.reduce((sum, s) => sum + (s.dedupRatio || 0), 0) / sourceStats.length).toFixed(
            4,
          ),
        )
      : 0;

  const dedupRate = totalArticles > 0 ? Number((multiSourceArticles / totalArticles).toFixed(4)) : 0;

  return {
    totalArticles,
    multiSourceArticles,
    dedupRate,
    avgDedupRatio,
    categoryBreakdown,
    sentimentBreakdown,
    sourceStats: sourceStats.map((source) => ({
      name: source.name,
      slug: source.slug,
      status: source.status,
      dedupRatio: source.dedupRatio,
      articlesFetched: source.articlesFetched,
      rateLimitRemaining: source.rateLimitRemaining,
      lastFetchedAt: source.lastFetchedAt,
    })),
  };
}

export async function getAnalytics() {
  const cacheKey = 'analytics:summary';
  const cached = await cacheGet(cacheKey);
  if (cached) return cached;

  const data = await computeAnalytics();
  await cacheSet(cacheKey, data, env.cacheTtlSeconds);
  return data;
}

export default { getAnalytics };
