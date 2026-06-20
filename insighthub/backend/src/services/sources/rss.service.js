import Parser from 'rss-parser';
import logger from '../../utils/logger.js';

const parser = new Parser({
  timeout: 15000,
  headers: { 'User-Agent': 'InsightHub/1.0' },
});

export async function fetchRssArticles(feedUrl) {
  if (!feedUrl) {
    logger.warn('RSS feed URL not configured, skipping fetch');
    return { articles: [], rateLimitRemaining: null };
  }

  const feed = await parser.parseURL(feedUrl);

  return {
    articles: feed.items || [],
    rateLimitRemaining: null,
    feedTitle: feed.title,
  };
}

export default { fetchRssArticles };
