import User from '../models/User.js';
import Article from '../models/Article.js';

const HISTORY_LIMIT = 100;

export async function recordReadingHistory(userId, articleId) {
  const article = await Article.findById(articleId).select('_id');
  if (!article) {
    const error = new Error('Article not found');
    error.statusCode = 404;
    throw error;
  }

  const user = await User.findById(userId);
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  const history = user.library?.readingHistory || [];
  const filtered = history.filter((entry) => entry.articleId.toString() !== articleId);
  filtered.unshift({ articleId, viewedAt: new Date() });

  user.library = user.library || {};
  user.library.readingHistory = filtered.slice(0, HISTORY_LIMIT);
  await user.save();

  return { recorded: true };
}

export async function getReadingHistory(userId, { page = 1, limit = 20 } = {}) {
  const user = await User.findById(userId).lean();
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  const history = user.library?.readingHistory || [];
  const skip = (page - 1) * limit;
  const slice = history.slice(skip, skip + limit);
  const articleIds = slice.map((h) => h.articleId);

  const articles = await Article.find({ _id: { $in: articleIds } })
    .populate('sources.sourceId', 'name slug type status')
    .lean();

  const articleMap = new Map(articles.map((a) => [a._id.toString(), a]));
  const data = slice
    .map((h) => ({
      viewedAt: h.viewedAt,
      article: articleMap.get(h.articleId.toString()) || null,
    }))
    .filter((h) => h.article);

  return { data, total: history.length, page, limit };
}

export async function saveArticle(userId, articleId) {
  const article = await Article.findById(articleId).select('_id');
  if (!article) {
    const error = new Error('Article not found');
    error.statusCode = 404;
    throw error;
  }

  const user = await User.findById(userId);
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  const saved = user.library?.savedArticles || [];
  const exists = saved.some((entry) => entry.articleId.toString() === articleId);
  if (!exists) {
    saved.unshift({ articleId, savedAt: new Date() });
    user.library = user.library || {};
    user.library.savedArticles = saved;
    await user.save();
  }

  return { saved: true };
}

export async function unsaveArticle(userId, articleId) {
  const user = await User.findById(userId);
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  user.library = user.library || {};
  user.library.savedArticles = (user.library.savedArticles || []).filter(
    (entry) => entry.articleId.toString() !== articleId,
  );
  await user.save();

  return { saved: false };
}

export async function getSavedArticles(userId, { page = 1, limit = 20 } = {}) {
  const user = await User.findById(userId).lean();
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  const saved = user.library?.savedArticles || [];
  const skip = (page - 1) * limit;
  const slice = saved.slice(skip, skip + limit);
  const articleIds = slice.map((s) => s.articleId);

  const articles = await Article.find({ _id: { $in: articleIds } })
    .populate('sources.sourceId', 'name slug type status')
    .lean();

  const articleMap = new Map(articles.map((a) => [a._id.toString(), a]));
  const data = slice
    .map((s) => ({
      savedAt: s.savedAt,
      article: articleMap.get(s.articleId.toString()) || null,
    }))
    .filter((s) => s.article);

  return { data, total: saved.length, page, limit };
}

export async function isArticleSaved(userId, articleId) {
  const user = await User.findById(userId).select('library.savedArticles').lean();
  if (!user) return false;
  return (user.library?.savedArticles || []).some(
    (entry) => entry.articleId.toString() === articleId,
  );
}

export default {
  recordReadingHistory,
  getReadingHistory,
  saveArticle,
  unsaveArticle,
  getSavedArticles,
  isArticleSaved,
};
