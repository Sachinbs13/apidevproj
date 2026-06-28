import { Router } from 'express';
import {
  getTrending,
  getTrendingTopicsHandler,
  getMostRead,
} from '../controllers/news.controller.js';

const router = Router();

router.get('/topics', getTrendingTopicsHandler);
router.get('/most-read', getMostRead);
router.get('/', getTrending);

export default router;
