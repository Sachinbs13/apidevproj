import { verifyToken } from '../utils/jwt.js';
import { verifyApiKey } from '../utils/generateApiKey.js';
import ApiKey from '../models/ApiKey.js';
import User from '../models/User.js';
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
      const decoded = verifyToken(token);
      const user = await User.findById(decoded.id).lean();
      if (!user) throw new Error('User not found');
      return { user, authType: 'jwt' };
    } catch (err) {
      throw new Error(err.message || 'Invalid JWT token');
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
        const user = await User.findById(candidate.userId).lean();
        return {
          user,
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
  const userId = socket.user?._id || socket.user?.id;
  logger.info('WebSocket client connected', {
    socketId: socket.id,
    userId,
    authType: socket.authType,
  });

  socket.emit('connected', {
    message: 'Connected to InsightHub live feed',
    userId,
  });

  // Automatically join regional state room
  if (socket.user?.preferences?.state && socket.user.preferences.state !== 'National') {
    const stateRoom = `state:${socket.user.preferences.state}`;
    socket.join(stateRoom);
    logger.info(`Socket automatically joined regional state room: ${stateRoom}`, { socketId: socket.id });
  }

  // Automatically join occupational room
  if (socket.user?.preferences?.occupation && socket.user.preferences.occupation !== 'General') {
    const occRoom = `occupation:${socket.user.preferences.occupation}`;
    socket.join(occRoom);
    logger.info(`Socket automatically joined occupational room: ${occRoom}`, { socketId: socket.id });
  }

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
