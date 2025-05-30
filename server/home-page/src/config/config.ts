import dotenv from 'dotenv';

dotenv.config();

export default {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/car-rent-homepage',
  apiPrefix: process.env.API_PREFIX || '/api/v1',
  bookingServiceUrl: process.env.BOOKING_SERVICE_URL || 'http://localhost:3001/api/v1',
  carServiceUrl: process.env.CAR_SERVICE_URL || 'http://localhost:3002/api/v1',
  feedbackServiceUrl: process.env.FEEDBACK_SERVICE_URL || 'http://localhost:3003/api/v1',
  userServiceUrl: process.env.USER_SERVICE_URL || 'http://localhost:3004/api/v1',
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
};