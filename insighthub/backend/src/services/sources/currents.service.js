import axios from 'axios';
import { env } from '../../config/env.js';
import logger from '../../utils/logger.js';
import { extractRateLimitRemaining } from '../sourceHealth.service.js';

const BASE_URL = 'https://api.currentsapi.services/v1';

function buildCountryCode() {
  return env.newsCountry.toUpperCase();
}

function buildRecentStartDate() {
  const since = new Date(Date.now() - 48 * 60 * 60 * 1000);
  return since.toISOString();
}

export async function fetchCurrentsArticles() {
  if (!env.currentsApiKey) {
    logger.warn('Currents API key not configured, skipping fetch');
    return { articles: [], rateLimitRemaining: null };
  }

  const headers = { Authorization: env.currentsApiKey };
  const country = buildCountryCode();

  const searchResponse = await axios.get(`${BASE_URL}/search`, {
    headers,
    params: {
      language: env.newsLang,
      country,
      start_date: buildRecentStartDate(),
    },
    timeout: 15000,
  });

  let articles = searchResponse.data?.news || [];

  if (articles.length === 0) {
    const latestResponse = await axios.get(`${BASE_URL}/latest-news`, {
      headers,
      params: { language: env.newsLang },
      timeout: 15000,
    });
    articles = latestResponse.data?.news || [];
  }

  return {
    articles,
    rateLimitRemaining: extractRateLimitRemaining(searchResponse.headers),
  };
}

export default { fetchCurrentsArticles };
