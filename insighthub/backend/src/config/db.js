import mongoose from 'mongoose';
import { env } from './env.js';
import logger from '../utils/logger.js';

export async function connectDB() {
  try {
    await mongoose.connect(env.mongodbUri);
    logger.info('MongoDB connected');
  } catch (error) {
    logger.error('MongoDB connection failed', { error: error.message });
    process.exit(1);
  }
}

mongoose.connection.on('disconnected', () => {
  logger.warn('MongoDB disconnected');
});
