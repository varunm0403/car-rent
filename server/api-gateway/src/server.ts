import app from './app';
import http from 'http';
import config from './config/config';
import { logger } from './utils/logger';

const PORT = config.port;
const server = http.createServer(app);

// Start the server
server.listen(PORT, () => {
  logger.info(`API Gateway listening on port ${PORT} in ${config.nodeEnv} mode`);
});

// Handle server errors
server.on('error', (error: NodeJS.ErrnoException) => {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof PORT === 'string' ? `Pipe ${PORT}` : `Port ${PORT}`;

  // Handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      logger.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      logger.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
});

// Graceful shutdown
const gracefulShutdown = () => {
  logger.info('Received shutdown signal, shutting down gracefully...');
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });

  // Force shutdown after 30s if server hasn't closed
  setTimeout(() => {
    logger.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 30000);
};

// Listen for termination signals
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason: Error) => {
  logger.error(`Unhandled Rejection: ${reason.message}`);
  logger.error(reason.stack || '');
});