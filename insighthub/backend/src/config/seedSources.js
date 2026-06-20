import Source from '../models/Source.js';
import { env } from '../config/env.js';
import logger from '../utils/logger.js';

const DEFAULT_SOURCES = [
  {
    name: 'NewsAPI.org',
    slug: 'newsapi',
    type: 'newsapi',
    baseUrl: 'https://newsapi.org/v2',
    cronExpression: env.pollIntervals.newsapi,
    pollingIntervalMinutes: 15,
  },
  {
    name: 'GNews',
    slug: 'gnews',
    type: 'gnews',
    baseUrl: 'https://gnews.io/api/v4',
    cronExpression: env.pollIntervals.gnews,
    pollingIntervalMinutes: 20,
  },
  {
    name: 'The Guardian',
    slug: 'guardian',
    type: 'guardian',
    baseUrl: 'https://content.guardianapis.com',
    cronExpression: env.pollIntervals.guardian,
    pollingIntervalMinutes: 10,
  },
  {
    name: 'The New York Times',
    slug: 'nyt',
    type: 'nyt',
    baseUrl: 'https://api.nytimes.com/svc/topstories/v2',
    cronExpression: env.pollIntervals.nyt,
    pollingIntervalMinutes: 30,
  },
];

function buildRssSources() {
  const defaultFeeds = [
    { name: 'BBC News', slug: 'rss-bbc', feedUrl: 'https://feeds.bbci.co.uk/news/rss.xml' },
    { name: 'Reuters', slug: 'rss-reuters', feedUrl: 'https://feeds.reuters.com/reuters/topNews' },
  ];

  const configuredFeeds = env.rssFeedUrls.map((feedUrl, index) => ({
    name: `RSS Feed ${index + 1}`,
    slug: `rss-feed-${index + 1}`,
    feedUrl,
  }));

  const feeds = configuredFeeds.length > 0 ? configuredFeeds : defaultFeeds;

  return feeds.map((feed) => ({
    name: feed.name,
    slug: feed.slug,
    type: 'rss',
    baseUrl: feed.feedUrl,
    cronExpression: env.pollIntervals.rss,
    pollingIntervalMinutes: 25,
    metadata: { feedUrl: feed.feedUrl },
  }));
}

export async function seedSources() {
  const allSources = [...DEFAULT_SOURCES, ...buildRssSources()];

  for (const sourceData of allSources) {
    await Source.findOneAndUpdate({ slug: sourceData.slug }, sourceData, {
      upsert: true,
      new: true,
    });
  }

  logger.info(`Default sources seeded (${allSources.length} total)`);
}

export default { seedSources, DEFAULT_SOURCES };
