import { Router } from 'express';
import { savePreferences } from '../controllers/auth.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/', authMiddleware, savePreferences);

export default router;
