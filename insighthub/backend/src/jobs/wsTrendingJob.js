import cron from 'node-cron';
import { env } from '../config/env.js';
import { getTrendingArticles } from '../services/trending.service.js';
import { emitTrending } from '../websocket/handlers.js';
import logger from '../utils/logger.js';

let trendingJob = null;

export function startTrendingPushJob() {
  const minutes = env.trendingPushIntervalMinutes;
  const cronExpression = minutes >= 60 ? `0 */${Math.floor(minutes / 60)} * * *` : `*/${minutes} * * * *`;

  if (!cron.validate(cronExpression)) {
    logger.warn(`Invalid trending cron expression: ${cronExpression}, using */5 * * * *`);
  }

  const expression = cron.validate(cronExpression) ? cronExpression : '*/5 * * * *';

  trendingJob = cron.schedule(expression, async () => {
    try {
      const articles = await getTrendingArticles({ limit: 20 });
      emitTrending(articles);
      logger.debug('Trending push emitted', { count: articles.length });
    } catch (error) {
      logger.error('Trending push job failed', { error: error.message });
    }
  });

  logger.info(`Trending push job scheduled every ${minutes} minute(s)`);
}

export function stopTrendingPushJob() {
  if (trendingJob) {
    trendingJob.stop();
    trendingJob = null;
  }
}

export function startWebSocketJobs() {
  startTrendingPushJob();
}

export default { startWebSocketJobs, stopTrendingPushJob };
