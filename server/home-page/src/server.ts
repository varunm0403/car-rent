import app from './app';
import config from './config/config';
import { connectToDatabase } from './config/database';
import logger from './config/logger';

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectToDatabase();
    
    // Start the server
    const server = app.listen(config.port, () => {
      logger.info(`Server running on port ${config.port}`);
      logger.info(`Environment: ${config.nodeEnv}`);
    });
    
    // Handle graceful shutdown
    process.on('SIGTERM', () => {
      logger.info('SIGTERM signal received: closing HTTP server');
      server.close(() => {
        logger.info('HTTP server closed');
      });
    });
    
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();