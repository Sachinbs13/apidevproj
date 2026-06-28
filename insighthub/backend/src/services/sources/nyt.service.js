import axios from 'axios';
import { env } from '../../config/env.js';
import logger from '../../utils/logger.js';
import { extractRateLimitRemaining } from '../sourceHealth.service.js';

const BASE_URL = 'https://api.nytimes.com/svc/topstories/v2';

export async function fetchNytArticles() {
  if (!env.nytApiKey) {
    logger.warn('NYT API key not configured, skipping fetch');
    return { articles: [], rateLimitRemaining: null };
  }

  const response = await axios.get(`${BASE_URL}/${env.nytSection}.json`, {
    params: { 'api-key': env.nytApiKey },
    timeout: 15000,
  });

  return {
    articles: response.data.results || [],
    rateLimitRemaining: extractRateLimitRemaining(response.headers),
  };
}

export default { fetchNytArticles };
