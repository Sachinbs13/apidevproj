import { Router } from 'express';
import { getTodayBrief } from '../controllers/brief.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

// Endpoint path will be registered as /api/brief
router.get('/today', authMiddleware, getTodayBrief);

export default router;
