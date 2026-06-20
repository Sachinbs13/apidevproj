import axios from 'axios';
import { env } from '../../config/env.js';
import logger from '../../utils/logger.js';
import { extractRateLimitRemaining } from '../sourceHealth.service.js';

const BASE_URL = 'https://content.guardianapis.com';

export async function fetchGuardianArticles() {
  if (!env.guardianApiKey) {
    logger.warn('Guardian API key not configured, skipping fetch');
    return { articles: [], rateLimitRemaining: null };
  }

  const response = await axios.get(`${BASE_URL}/search`, {
    params: {
      'api-key': env.guardianApiKey,
      'show-fields': 'bodyText,trailText,thumbnail,byline',
      'page-size': 50,
      orderBy: 'newest',
    },
    timeout: 15000,
  });

  return {
    articles: response.data.response?.results || [],
    rateLimitRemaining: extractRateLimitRemaining(response.headers),
  };
}

export default { fetchGuardianArticles };
