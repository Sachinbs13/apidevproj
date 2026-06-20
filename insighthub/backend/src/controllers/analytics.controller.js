import { getAnalytics } from '../services/analytics.service.js';

export async function getAnalyticsHandler(req, res, next) {
  try {
    const data = await getAnalytics();
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}
