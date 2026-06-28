import Article from '../models/Article.js';
import Source from '../models/Source.js';
import { getTrendingArticles } from '../services/trending.service.js';
import { getPersonalizedFeed } from '../services/recommendation.service.js';
import { translateText } from '../services/language.service.js';
import { cacheGet, cacheSet, buildCacheKey } from '../services/cache.service.js';
import { env } from '../config/env.js';

function buildHealthSummary(sources) {
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

export async function getNews(req, res, next) {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 20));
    const skip = (page - 1) * limit;

    const filter = {};

    if (req.query.category) {
      filter.category = req.query.category.toLowerCase();
    }

    if (req.query.state) {
      filter['regionalInfo.state'] = req.query.state;
    }

    if (req.query.source) {
      filter['sources.sourceName'] = new RegExp(req.query.source, 'i');
    }

    if (req.query.from || req.query.to) {
      filter.publishedAt = {};
      if (req.query.from) filter.publishedAt.$gte = new Date(req.query.from);
      if (req.query.to) filter.publishedAt.$lte = new Date(req.query.to);
    }

    const cacheKey = buildCacheKey('news', {
      page,
      limit,
      category: req.query.category || '',
      source: req.query.source || '',
      from: req.query.from || '',
      to: req.query.to || '',
      state: req.query.state || '',
    });

    const cached = await cacheGet(cacheKey);
    if (cached) {
      return res.json(cached);
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

    const response = {
      success: true,
      data: articles,
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

export async function getArticleById(req, res, next) {
  try {
    const article = await Article.findById(req.params.id)
      .populate('sources.sourceId', 'name slug type status baseUrl')
      .lean();

    if (!article) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }

    res.json({
      success: true,
      data: {
        ...article,
        sourceCount: article.sources?.length || 0,
        variants: article.sources?.map((ref) => ({
          sourceName: ref.sourceName,
          originalUrl: ref.originalUrl,
          fetchedAt: ref.fetchedAt,
          source: ref.sourceId,
        })),
      },
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'Invalid article ID' });
    }
    next(error);
  }
}

export async function compareByTopic(req, res, next) {
  try {
    const topic = req.query.topic?.trim();
    if (!topic) {
      return res.status(400).json({ success: false, message: 'Query parameter "topic" is required' });
    }

    const regex = new RegExp(topic, 'i');
    const articles = await Article.find({
      $or: [{ title: regex }, { description: regex }, { category: regex }],
      $expr: { $gte: [{ $size: '$sources' }, 1] },
    })
      .sort({ publishedAt: -1 })
      .limit(20)
      .populate('sources.sourceId', 'name slug type status')
      .lean();

    const multiSource = articles.filter((a) => a.sources?.length > 1);
    const singleSource = articles.filter((a) => a.sources?.length <= 1);

    res.json({
      success: true,
      data: {
        topic,
        multiSource,
        singleSource,
        total: articles.length,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getTrending(req, res, next) {
  try {
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 20));
    const windowHours = Math.min(
      168,
      Math.max(1, parseInt(req.query.windowHours, 10) || env.trendingWindowHours),
    );

    const articles = await getTrendingArticles({ limit, windowHours });

    res.json({
      success: true,
      data: articles,
      meta: { limit, windowHours, count: articles.length },
    });
  } catch (error) {
    next(error);
  }
}

export async function getSources(req, res, next) {
  try {
    const sources = await Source.find().sort({ name: 1 }).lean();

    res.json({
      success: true,
      data: sources,
      health: buildHealthSummary(sources),
    });
  } catch (error) {
    next(error);
  }
}

export async function getPersonalizedNews(req, res, next) {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 20));

    // req.user contains the authenticated user details populated by authMiddleware
    const feed = await getPersonalizedFeed(req.user, limit, page);
    res.json({
      success: true,
      data: feed
    });
  } catch (error) {
    next(error);
  }
}

export async function getArticleSummary(req, res, next) {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }

    const lang = req.query.lang || 'English';
    const textToTranslate = article.description || article.title || '';
    const translated = translateText(textToTranslate, lang, article.category);

    res.json({
      success: true,
      data: {
        articleId: article._id,
        language: lang,
        summary: translated
      }
    });
  } catch (error) {
    next(error);
  }
}
