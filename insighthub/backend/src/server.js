import http from 'http';
import app from './app.js';
import { env } from './config/env.js';
import { connectDB } from './config/db.js';
import { connectRedis } from './config/redis.js';
import { initSocket } from './config/socket.js';
import { seedSources } from './config/seedSources.js';
import { startFetchScheduler } from './jobs/fetchScheduler.js';
import { startWebSocketJobs } from './jobs/wsTrendingJob.js';
import logger from './utils/logger.js';

async function bootstrap() {
  await connectDB();
  await connectRedis();
  await seedSources();
  await startFetchScheduler();

  const httpServer = http.createServer(app);
  initSocket(httpServer);
  startWebSocketJobs();

  httpServer.listen(env.port, () => {
    logger.info(`Server running on port ${env.port} [${env.nodeEnv}]`);
    logger.info(`WebSocket ready — connect with JWT in handshake auth.token`);
  });
}

bootstrap().catch((error) => {
  logger.error('Failed to start server', { error: error.message });
  process.exit(1);
});
