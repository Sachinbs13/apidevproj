import { Router } from 'express';
import {
  register,
  login,
  savePreferences,
  createApiKey,
  listApiKeys,
  revokeApiKey,
  getProfile,
} from '../controllers/auth.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.get('/me', authMiddleware, getProfile);
router.post('/api-keys', authMiddleware, createApiKey);
router.get('/api-keys', authMiddleware, listApiKeys);
router.delete('/api-keys/:id', authMiddleware, revokeApiKey);

export default router;