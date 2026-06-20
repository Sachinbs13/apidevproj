import dotenvSafe from 'dotenv-safe';

dotenvSafe.config({
  allowEmptyValues: true,
  example: '.env.example',
});

const requiredInProduction = ['MONGODB_URI', 'JWT_SECRET'];

function validateEnv() {
  if (process.env.NODE_ENV === 'production') {
    const missing = requiredInProduction.filter((key) => !process.env[key]);
    if (missing.length > 0) {
      throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }
  }
}

validateEnv();

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '5000', 10),
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/insighthub',
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
  redisEnabled: process.env.REDIS_ENABLED !== 'false',
  cacheTtlSeconds: parseInt(process.env.CACHE_TTL_SECONDS || '300', 10),
  newsApiKey: process.env.NEWSAPI_KEY || '',
  gnewsApiKey: process.env.GNEWS_API_KEY || '',
  guardianApiKey: process.env.GUARDIAN_API_KEY || '',
  nytApiKey: process.env.NYT_API_KEY || '',
  rssFeedUrls: (process.env.RSS_FEED_URLS || '')
    .split(',')
    .map((url) => url.trim())
    .filter(Boolean),
  dedupSimilarityThreshold: parseFloat(process.env.DEDUP_SIMILARITY_THRESHOLD || '0.75'),
  dedupLookbackDays: parseInt(process.env.DEDUP_LOOKBACK_DAYS || '7', 10),
  trendingWindowHours: parseInt(process.env.TRENDING_WINDOW_HOURS || '24', 10),
  trendingPushIntervalMinutes: parseInt(process.env.TRENDING_PUSH_INTERVAL_MINUTES || '5', 10),
  breakingSpikeThreshold: parseInt(process.env.BREAKING_SPIKE_THRESHOLD || '8', 10),
  breakingKeywords: (process.env.BREAKING_KEYWORDS || 'breaking,urgent,alert')
    .split(',')
    .map((k) => k.trim().toLowerCase())
    .filter(Boolean),
  jwtSecret: process.env.JWT_SECRET || 'dev-secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  fetchCronDefault: process.env.FETCH_CRON_DEFAULT || '*/15 * * * *',
  pollIntervals: {
    newsapi: process.env.NEWSAPI_POLL_INTERVAL || '*/15 * * * *',
    gnews: process.env.GNEWS_POLL_INTERVAL || '*/20 * * * *',
    guardian: process.env.GUARDIAN_POLL_INTERVAL || '*/10 * * * *',
    nyt: process.env.NYT_POLL_INTERVAL || '*/30 * * * *',
    rss: process.env.RSS_POLL_INTERVAL || '*/25 * * * *',
  },
};
