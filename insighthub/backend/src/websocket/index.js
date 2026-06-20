import { verifyToken } from '../utils/jwt.js';
import { verifyApiKey } from '../utils/generateApiKey.js';
import ApiKey from '../models/ApiKey.js';
import logger from '../utils/logger.js';
import {
  joinTopicRoom,
  leaveTopicRoom,
  joinCategoryRoom,
  leaveCategoryRoom,
} from './rooms.js';

async function authenticateHandshake(handshake) {
  const token = handshake.auth?.token || handshake.query?.token;
  const apiKey = handshake.auth?.apiKey || handshake.query?.apiKey;

  if (token) {
    try {
      return { user: verifyToken(token), authType: 'jwt' };
    } catch {
      throw new Error('Invalid JWT token');
    }
  }

  if (apiKey) {
    const prefix = apiKey.slice(0, 11);
    const candidates = await ApiKey.find({ prefix, isActive: true }).select('+keyHash');

    for (const candidate of candidates) {
      const valid = await verifyApiKey(apiKey, candidate.keyHash);
      if (valid) {
        if (candidate.expiresAt && candidate.expiresAt < new Date()) {
          throw new Error('API key expired');
        }
        return {
          user: { id: candidate.userId, authType: 'apiKey' },
          authType: 'apiKey',
          apiKeyId: candidate._id,
        };
      }
    }
    throw new Error('Invalid API key');
  }

  throw new Error('Authentication required — provide token or apiKey in handshake auth');
}

export function registerSocketHandlers(io, socket) {
  logger.info('WebSocket client connected', {
    socketId: socket.id,
    userId: socket.user?.id,
    authType: socket.authType,
  });

  socket.emit('connected', {
    message: 'Connected to InsightHub live feed',
    userId: socket.user?.id,
  });

  socket.on('subscribe:topic', ({ topic, category } = {}) => {
    if (topic) {
      const room = joinTopicRoom(socket, topic);
      socket.emit('subscribed:topic', { topic, room });
      logger.debug('Client subscribed to topic', { socketId: socket.id, topic, room });
    }

    if (category) {
      const room = joinCategoryRoom(socket, category);
      socket.emit('subscribed:category', { category, room });
      logger.debug('Client subscribed to category', { socketId: socket.id, category, room });
    }

    if (!topic && !category) {
      socket.emit('error', { message: 'Provide topic or category to subscribe' });
    }
  });

  socket.on('unsubscribe:topic', ({ topic, category } = {}) => {
    if (topic) {
      const room = leaveTopicRoom(socket, topic);
      socket.emit('unsubscribed:topic', { topic, room });
    }

    if (category) {
      const room = leaveCategoryRoom(socket, category);
      socket.emit('unsubscribed:category', { category, room });
    }
  });

  socket.on('disconnect', (reason) => {
    logger.info('WebSocket client disconnected', { socketId: socket.id, reason });
  });
}

export async function socketAuthMiddleware(socket, next) {
  try {
    const auth = await authenticateHandshake(socket.handshake);
    socket.user = auth.user;
    socket.authType = auth.authType;
    next();
  } catch (error) {
    next(new Error(error.message));
  }
}

export default { registerSocketHandlers, socketAuthMiddleware };
