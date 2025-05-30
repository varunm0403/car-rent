import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const config = {
  // Server configuration
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Service URLs
  authServiceUrl: process.env.AUTH_SERVICE_URL || 'http://localhost:3001',
  carBookingServiceUrl: process.env.CAR_BOOKING_SERVICE_URL || 'http://localhost:3002',
  homePageServiceUrl: process.env.HOME_PAGE_SERVICE_URL || 'http://home-page-service:3003',
  reportServiceUrl: process.env.REPORT_SERVICE_URL || 'http://report-generation-service:3004',
  
  // CORS configuration
  corsOrigin: process.env.CORS_ORIGIN || '*',
  
  // Logging
  logLevel: process.env.LOG_LEVEL || 'info',
};

export default config;