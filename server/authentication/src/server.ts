import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import { connectToDatabase, disconnectFromDatabase } from './config/database';
import { logger } from './utils/logger';

const PORT = process.env.PORT || 3001;

const startServer = async () => {
  try {
    // Connect to database
    await connectToDatabase();
    
    // Start server
    const server = app.listen(PORT, () => {
      logger.info(`Authentication service running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
    });
    
    // Handle graceful shutdown
    const gracefulShutdown = async () => {
      logger.info('Received shutdown signal, shutting down gracefully...');
      
      server.close(async () => {
        logger.info('HTTP server closed');
        
        // Disconnect from database
        await disconnectFromDatabase();
        
        logger.info('All connections closed, process exiting');
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
    
  } catch (error) {
    logger.error(`Failed to start server: ${error}`);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason: Error) => {
  logger.error(`Unhandled Rejection: ${reason.message}`);
  logger.error(reason.stack || '');
});

// Start the server
startServer();