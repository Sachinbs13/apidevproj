import { Router } from 'express';
import { getAnalyticsHandler } from '../controllers/analytics.controller.js';
import { getRegionalAnalytics } from '../controllers/region.controller.js';

const router = Router();

router.get('/', getAnalyticsHandler);
router.get('/regions', getRegionalAnalytics);

export default router;
