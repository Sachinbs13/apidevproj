import { Router } from 'express';
import { getNews, getArticleById, compareByTopic } from '../controllers/news.controller.js';

const router = Router();

router.get('/compare', compareByTopic);
router.get('/', getNews);
router.get('/:id', getArticleById);

export default router;
