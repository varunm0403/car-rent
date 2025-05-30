import mongoose from 'mongoose';
import { logger } from '../utils/logger';

export const connectToDatabase = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/authentication-service';
    
    await mongoose.connect(mongoUri);
    logger.info('MongoDB connected successfully');
  } catch (error: any) {
    logger.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

export const disconnectFromDatabase = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    logger.info('MongoDB disconnected successfully');
  } catch (error: any) {
    logger.error(`MongoDB disconnection error: ${error.message}`);
  }
};