import { Router } from 'express';
import { getRecommendedSchemes } from '../controllers/scheme.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

// Endpoint path will be registered under /api/schemes
router.get('/recommend', authMiddleware, getRecommendedSchemes);

export default router;
