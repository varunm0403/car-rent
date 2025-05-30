import dotenv from 'dotenv';
import app from './app';
import logger from './utils/logger';
import config from './config/config';

// Load environment variables
dotenv.config();

const PORT = config.port;

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  logger.error(error.name, error.message);
  process.exit(1);
});

// Start the server
const server = app.listen(PORT, () => {
  logger.info(`Report Generation Service running on port ${PORT} in ${config.nodeEnv} mode`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (error: Error) => {
  logger.error('UNHANDLED REJECTION! 💥 Shutting down...');
  logger.error(error.name, error.message);
  server.close(() => {
    process.exit(1);
  });
});

// Handle SIGTERM signal
process.on('SIGTERM', () => {
  logger.info('👋 SIGTERM RECEIVED. Shutting down gracefully');
  server.close(() => {
    logger.info('💥 Process terminated!');
  });
});