import { Server } from 'socket.io';
import { env } from './env.js';
import logger from '../utils/logger.js';
import { registerSocketHandlers, socketAuthMiddleware } from '../websocket/index.js';

let io = null;

export function initSocket(httpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: env.corsOrigin,
      credentials: true,
    },
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  io.use(socketAuthMiddleware);

  io.on('connection', (socket) => {
    registerSocketHandlers(io, socket);
  });

  io.on('connect_error', (error) => {
    logger.error('WebSocket connection error', { error: error.message });
  });

  logger.info('Socket.io initialized');
  return io;
}

export function getIO() {
  return io;
}

export default { initSocket, getIO };
