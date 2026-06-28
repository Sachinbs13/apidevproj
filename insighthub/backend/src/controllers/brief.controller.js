import { getMorningBriefForUser } from '../services/brief.service.js';
import User from '../models/User.js';

export async function getTodayBrief(req, res, next) {
  try {
    const todayStr = new Date().toISOString().split('T')[0];
    const lang = req.query.lang || 'English';

    // req.user is loaded via authMiddleware
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User profile not found' });
    }

    const brief = await getMorningBriefForUser(user, todayStr, lang);

    res.json({
      success: true,
      data: brief
    });
  } catch (error) {
    next(error);
  }
}

export default { getTodayBrief };
