import {
  recordReadingHistory,
  getReadingHistory,
  saveArticle,
  unsaveArticle,
  getSavedArticles,
  isArticleSaved,
} from '../services/userLibrary.service.js';

export async function recordHistory(req, res, next) {
  try {
    await recordReadingHistory(req.user.id, req.params.articleId);
    res.json({ success: true, message: 'History recorded' });
  } catch (error) {
    next(error);
  }
}

export async function getHistory(req, res, next) {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 20));
    const result = await getReadingHistory(req.user.id, { page, limit });
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
}

export async function saveArticleHandler(req, res, next) {
  try {
    await saveArticle(req.user.id, req.params.articleId);
    res.json({ success: true, message: 'Article saved' });
  } catch (error) {
    next(error);
  }
}

export async function unsaveArticleHandler(req, res, next) {
  try {
    await unsaveArticle(req.user.id, req.params.articleId);
    res.json({ success: true, message: 'Article removed from saved' });
  } catch (error) {
    next(error);
  }
}

export async function getSaved(req, res, next) {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 20));
    const result = await getSavedArticles(req.user.id, { page, limit });
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
}

export async function getSavedStatus(req, res, next) {
  try {
    const saved = await isArticleSaved(req.user.id, req.params.articleId);
    res.json({ success: true, data: { saved } });
  } catch (error) {
    next(error);
  }
}
