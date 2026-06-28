import axios from 'axios';
import { env } from '../../config/env.js';
import logger from '../../utils/logger.js';
import { extractRateLimitRemaining } from '../sourceHealth.service.js';

const BASE_URL = 'https://newsapi.org/v2';

export async function fetchNewsApiArticles() {
  if (!env.newsApiKey) {
    logger.warn('NewsAPI key not configured, skipping fetch');
    return { articles: [], rateLimitRemaining: null };
  }

  const response = await axios.get(`${BASE_URL}/top-headlines`, {
    params: {
      apiKey: env.newsApiKey,
      country: env.newsCountry,
      pageSize: 50,
    },
    timeout: 15000,
  });

  return {
    articles: response.data.articles || [],
    rateLimitRemaining: extractRateLimitRemaining(response.headers),
  };
}

export default { fetchNewsApiArticles };
