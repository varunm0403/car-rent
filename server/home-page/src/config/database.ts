import mongoose from 'mongoose';
import config from './config';
import logger from './logger';

export const connectToDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(config.mongoUri);
    logger.info('Connected to MongoDB');
  } catch (error) {
    logger.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export const disconnectFromDatabase = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    logger.info('Disconnected from MongoDB');
  } catch (error) {
    logger.error('Error disconnecting from MongoDB:', error);
  }
};