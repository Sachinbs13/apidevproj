import cron from 'node-cron';
import Source from '../models/Source.js';
import { ingestFromSource } from '../services/aggregator.service.js';
import logger from '../utils/logger.js';

const activeJobs = new Map();

function scheduleSourceJob(source) {
  if (activeJobs.has(source.slug)) {
    activeJobs.get(source.slug).stop();
    activeJobs.delete(source.slug);
  }

  if (!cron.validate(source.cronExpression)) {
    logger.warn(`Invalid cron expression for ${source.name}: ${source.cronExpression}`);
    return;
  }

  const job = cron.schedule(source.cronExpression, async () => {
    logger.info(`Scheduled fetch started: ${source.name}`);
    try {
      await ingestFromSource(source.slug);
    } catch (error) {
      logger.error(`Scheduled fetch failed: ${source.name}`, { error: error.message });
    }
  });

  activeJobs.set(source.slug, job);
  logger.info(`Scheduled ${source.name} with cron: ${source.cronExpression}`);
}

export async function startFetchScheduler() {
  const sources = await Source.find({ status: { $ne: 'down' } });

  for (const source of sources) {
    scheduleSourceJob(source);
  }

  logger.info(`Fetch scheduler started for ${sources.length} source(s)`);
}

export function stopFetchScheduler() {
  for (const [slug, job] of activeJobs) {
    job.stop();
    activeJobs.delete(slug);
    logger.info(`Stopped scheduler for ${slug}`);
  }
}

export default { startFetchScheduler, stopFetchScheduler };
