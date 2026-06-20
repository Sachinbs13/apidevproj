import ApiKey from '../models/ApiKey.js';
import { verifyApiKey } from '../utils/generateApiKey.js';

export async function apiKeyMiddleware(req, res, next) {
  const plainKey = req.headers['x-api-key'];

  if (!plainKey) {
    return next();
  }

  try {
    const prefix = plainKey.slice(0, 11);
    const candidates = await ApiKey.find({ prefix, isActive: true }).select('+keyHash');

    for (const candidate of candidates) {
      const valid = await verifyApiKey(plainKey, candidate.keyHash);
      if (valid) {
        if (candidate.expiresAt && candidate.expiresAt < new Date()) {
          return res.status(401).json({ success: false, message: 'API key expired' });
        }

        candidate.lastUsedAt = new Date();
        candidate.requestCount += 1;
        await candidate.save();

        req.apiKey = { id: candidate._id, userId: candidate.userId, name: candidate.name };
        return next();
      }
    }

    return res.status(401).json({ success: false, message: 'Invalid API key' });
  } catch (error) {
    next(error);
  }
}

export function requireApiKeyOrAuth(req, res, next) {
  if (req.apiKey || req.user) {
    return next();
  }
  return res.status(401).json({
    success: false,
    message: 'Authentication required — provide Bearer token or X-API-Key header',
  });
}
