import axios from 'axios';
import { env } from '../../config/env.js';
import logger from '../../utils/logger.js';
import { extractRateLimitRemaining } from '../sourceHealth.service.js';

const BASE_URL = 'https://gnews.io/api/v4';

export async function fetchGNewsArticles() {
  if (!env.gnewsApiKey) {
    logger.warn('GNews API key not configured, skipping fetch');
    return { articles: [], rateLimitRemaining: null };
  }

  const response = await axios.get(`${BASE_URL}/top-headlines`, {
    params: {
      token: env.gnewsApiKey,
      country: env.newsCountry,
      lang: env.newsLang,
      max: 50,
    },
    timeout: 15000,
  });

  return {
    articles: response.data.articles || [],
    rateLimitRemaining: extractRateLimitRemaining(response.headers),
  };
}

export default { fetchGNewsArticles };
