import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import {
  recordHistory,
  getHistory,
  saveArticleHandler,
  unsaveArticleHandler,
  getSaved,
  getSavedStatus,
} from '../controllers/user.controller.js';

const router = Router();

router.use(authMiddleware);

router.get('/saved', getSaved);
router.get('/saved/:articleId/status', getSavedStatus);
router.post('/saved/:articleId', saveArticleHandler);
router.delete('/saved/:articleId', unsaveArticleHandler);

router.get('/history', getHistory);
router.post('/history/:articleId', recordHistory);

export default router;
