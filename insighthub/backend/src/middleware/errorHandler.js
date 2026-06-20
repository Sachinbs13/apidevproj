import logger from '../utils/logger.js';

export function notFoundHandler(_req, res) {
  res.status(404).json({ success: false, message: 'Route not found' });
}

export function errorHandler(err, _req, res, _next) {
  logger.error(err.message, { stack: err.stack });

  const status = err.statusCode || 500;
  res.status(status).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
}
