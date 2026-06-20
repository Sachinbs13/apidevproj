import Article from '../models/Article.js';
import { cacheGet, cacheSet, buildCacheKey } from '../services/cache.service.js';
import { env } from '../config/env.js';

export async function search(req, res, next) {
  try {
    const query = req.query.q?.trim();
    if (!query) {
      return res.status(400).json({ success: false, message: 'Query parameter "q" is required' });
    }

    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 20));
    const skip = (page - 1) * limit;

    const cacheKey = buildCacheKey('search', {
      q: query,
      page,
      limit,
      category: req.query.category || '',
    });

    const cached = await cacheGet(cacheKey);
    if (cached) return res.json(cached);

    const filter = { $text: { $search: query } };

    if (req.query.category) {
      filter.category = req.query.category.toLowerCase();
    }

    const [articles, total] = await Promise.all([
      Article.find(filter, { score: { $meta: 'textScore' } })
        .sort({ score: { $meta: 'textScore' }, publishedAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('sources.sourceId', 'name slug type status')
        .lean(),
      Article.countDocuments(filter),
    ]);

    const response = {
      success: true,
      data: articles,
      query,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    };

    await cacheSet(cacheKey, response, env.cacheTtlSeconds);
    res.json(response);
  } catch (error) {
    next(error);
  }
}
