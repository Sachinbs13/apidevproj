import { Router } from 'express';
import { getTrendingRegions, getRegionalAnalytics } from '../controllers/region.controller.js';

const router = Router();

// Endpoints path will be registered under /api/regions
router.get('/trending', getTrendingRegions);
router.get('/analytics', getRegionalAnalytics);

export default router;
