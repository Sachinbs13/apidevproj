import { Router } from 'express';
import { getTrending } from '../controllers/news.controller.js';

const router = Router();

router.get('/', getTrending);

export default router;
