import cron from 'node-cron';
import Source from '../models/Source.js';
import { ingestFromSource } from '../services/aggregator.service.js';
import { generateDailyBriefs } from '../services/brief.service.js';
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

  // Schedule a daily job at 6:00 AM to pre-generate morning briefs
  const morningBriefJob = cron.schedule('0 6 * * *', async () => {
    const todayStr = new Date().toISOString().split('T')[0];
    try {
      await generateDailyBriefs(todayStr);
      logger.info(`Automatically generated daily morning briefs for ${todayStr}`);
    } catch (error) {
      logger.error(`Failed to automatically generate morning briefs: ${error.message}`);
    }
  });
  activeJobs.set('__morning_briefs__', morningBriefJob);

  logger.info(`Fetch scheduler started for ${sources.length} source(s) and morning briefs cron`);
}

export function stopFetchScheduler() {
  for (const [slug, job] of activeJobs) {
    job.stop();
    activeJobs.delete(slug);
    logger.info(`Stopped scheduler for ${slug}`);
  }
}

export default { startFetchScheduler, stopFetchScheduler };
