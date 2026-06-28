import { Router } from 'express';
import { getNews, getLocalNews, getArticleById, compareByTopic, getPersonalizedNews, getArticleSummary } from '../controllers/news.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/compare', compareByTopic);
router.get('/local', getLocalNews);
router.get('/feed/personalized', authMiddleware, getPersonalizedNews);
router.get('/summary/:id', getArticleSummary);
router.get('/', getNews);
router.get('/:id', getArticleById);

export default router;
