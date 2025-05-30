import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config();

const config = {
  // Server configuration
  port: parseInt(process.env.REPORT_SERVICE_PORT || process.env.PORT || '3004', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // MongoDB configuration
  mongoUri: process.env.MONGODB_URI || 'mongodb+srv://vaishnavi:brightstack@cluster0.hdlyf5a.mongodb.net/report-service',
  
  // JWT configuration
  jwtSecret: process.env.JWT_SECRET || 'c60b356c446717a892365db72772df8281605184b9c34b0453fc9a699d5e3b349f75ab162047dcdace34cdcc4aaa0f37b0bfd05619306a66a887c7b5372feaae490731b915919f7308b224730a61b43c7b0db35d7d8801a1118edd647898fdd37c82c62970c1ae11c41958fffb6950252d26dd9d5b6cdf09f0146011442667a79718f1c944ffa6efc7f80a4030d99d900ee0e13eb0781104013ef9e7a58f12bf',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
  
  // CORS configuration
  allowedOrigins: (process.env.ALLOWED_ORIGINS || 'http://localhost:3000').split(','),
  
  // Report storage configuration
  reportsDir: process.env.REPORTS_DIR || path.join(process.cwd(), 'reports/files'),
  baseUrl: process.env.BASE_URL || `http://localhost:${process.env.REPORT_SERVICE_PORT || 3004}/reports/files`,
  
  // Email configuration
  email: {
    host: process.env.EMAIL_HOST || '',
    port: parseInt(process.env.EMAIL_PORT || '587', 10),
    secure: process.env.EMAIL_PORT === '465',
    auth: {
      user: process.env.EMAIL_USER || '',
      pass: process.env.EMAIL_PASS || '',
    },
  },
  
  // Microservices URLs (without /api prefix)
  services: {
    authServiceUrl: process.env.AUTH_SERVICE_URL || 'http://localhost:3001',
    carBookingServiceUrl: process.env.CAR_BOOKING_SERVICE_URL || 'http://localhost:3002',
    homePageServiceUrl: process.env.HOME_PAGE_SERVICE_URL || 'http://localhost:3003',
  },
  
  // Logging configuration
  logs: {
    level: process.env.LOG_LEVEL || 'info',
  },
};

export default config;