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
    metadata: { country: env.newsCountry },
  },
  {
    name: 'GNews',
    slug: 'gnews',
    type: 'gnews',
    baseUrl: 'https://gnews.io/api/v4',
    cronExpression: env.pollIntervals.gnews,
    pollingIntervalMinutes: 20,
    metadata: { country: env.newsCountry, lang: env.newsLang },
  },
  {
    name: 'The Guardian',
    slug: 'guardian',
    type: 'guardian',
    baseUrl: 'https://content.guardianapis.com',
    cronExpression: env.pollIntervals.guardian,
    pollingIntervalMinutes: 10,
    metadata: { section: env.guardianSection },
  },
  {
    name: 'The New York Times',
    slug: 'nyt',
    type: 'nyt',
    baseUrl: 'https://api.nytimes.com/svc/topstories/v2',
    cronExpression: env.pollIntervals.nyt,
    pollingIntervalMinutes: 30,
    metadata: { section: env.nytSection },
  },
  {
    name: 'Currents API',
    slug: 'currents',
    type: 'currents',
    baseUrl: 'https://api.currentsapi.services/v1',
    cronExpression: env.pollIntervals.currents,
    pollingIntervalMinutes: 20,
    metadata: { country: env.newsCountry.toUpperCase(), lang: env.newsLang },
  },
];

const INDIAN_DEFAULT_FEEDS = [
  {
    name: 'The Hindu',
    slug: 'rss-hindu',
    feedUrl: 'https://www.thehindu.com/news/national/feeder/default.rss',
  },
  {
    name: 'Indian Express',
    slug: 'rss-indian-express',
    feedUrl: 'https://indianexpress.com/section/india/feed/',
  },
  {
    name: 'BBC India',
    slug: 'rss-bbc-india',
    feedUrl: 'https://feeds.bbci.co.uk/news/world/asia/india/rss.xml',
  },
];

const LEGACY_FEED_SLUGS = ['rss-bbc', 'rss-reuters'];

function buildRssSources() {
  const configuredFeeds = env.rssFeedUrls.map((feedUrl, index) => ({
    name: `RSS Feed ${index + 1}`,
    slug: `rss-feed-${index + 1}`,
    feedUrl,
  }));

  const feeds = configuredFeeds.length > 0 ? configuredFeeds : INDIAN_DEFAULT_FEEDS;

  return feeds.map((feed) => ({
    name: feed.name,
    slug: feed.slug,
    type: 'rss',
    baseUrl: feed.feedUrl,
    cronExpression: env.pollIntervals.rss,
    pollingIntervalMinutes: 25,
    status: 'active',
    metadata: { feedUrl: feed.feedUrl, region: 'India' },
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

  await Source.updateMany(
    { slug: { $in: LEGACY_FEED_SLUGS } },
    { $set: { status: 'down', lastError: 'Replaced by India-focused RSS feeds' } },
  );

  logger.info(
    `Default sources seeded (${allSources.length} total, country=${env.newsCountry})`,
  );
}

export default { seedSources, DEFAULT_SOURCES, INDIAN_DEFAULT_FEEDS };
