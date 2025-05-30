import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { createProxyMiddleware, fixRequestBody } from 'http-proxy-middleware';
import config from './config/config';
import { loggerMiddleware } from './middlewares/logger.middleware';
import { errorMiddleware } from './middlewares/error.middleware';
import { logger } from './utils/logger';
import { authenticate, authorize } from './middlewares/auth.middleware';
import { USER_ROLES } from './config/constants';
import bookingProxy from './routes/booking.proxy';
const app: Express = express();
 
// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(morgan('dev')); // HTTP request logging
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(loggerMiddleware); // Custom request logging

app.use('/bookings', bookingProxy);
// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    service: 'api-gateway',
    timestamp: new Date().toISOString()
  });
});

// Define public routes that don't require authentication
const publicRoutes = [
  '/auth/sign-in',
  '/auth/sign-up',
  '/home',
  '/home/about-us',
  '/home/locations',
  '/home/faq',
  '/home/popular-cars',
  '/cars/available',
  '/cars/details',
  '/health'
];

// Define routes that require authentication
const protectedRoutes = [
  '/users/profile',
  '/users/update',
  '/users/change-password',
  '/bookings/create',
  '/bookings/user',
  '/bookings/cancel',
  '/feedbacks/create',
  '/cars/favorites'
];

// Define routes that require admin/support role
const adminRoutes = [
  '/admin',
  '/reports',
  '/users/all',
  '/bookings/all',
  '/cars/manage'
];

// Authentication middleware for protected routes
app.use((req: Request, res: Response, next: NextFunction) => {
  const path = req.path;
  
  // Skip authentication for public routes
  if (publicRoutes.some(route => path.startsWith(route))) {
    return next();
  }
  
  // Require admin/support role for admin routes
  if (adminRoutes.some(route => path.startsWith(route))) {
    return authenticate(req, res, () => {
      authorize([USER_ROLES.ADMIN, USER_ROLES.SUPPORT_AGENT])(req, res, next);
    });
  }
  
  // Require authentication for protected routes
  if (protectedRoutes.some(route => path.startsWith(route))) {
    return authenticate(req, res, next);
  }
  
  // Default to requiring authentication for any other routes
  authenticate(req, res, next);
});

// Define service routes and their corresponding microservice URLs
const serviceRoutes = {
  '/auth': config.authServiceUrl,
  '/cars': config.carBookingServiceUrl,
  '/bookings': config.carBookingServiceUrl,
  '/feedbacks': config.carBookingServiceUrl,
  '/home': config.homePageServiceUrl,
  '/reports': config.reportServiceUrl,
  '/users': config.authServiceUrl,
  '/admin': config.authServiceUrl,

  // More specific routes for home page components
  '/home/about-us': config.homePageServiceUrl,
  '/home/locations': config.homePageServiceUrl,
  '/home/faq': config.homePageServiceUrl,
  '/home/popular-cars': config.carBookingServiceUrl + '/cars/popular',
};
 
// Set up proxy middleware for each service route
Object.entries(serviceRoutes).forEach(([path, target]) => {
  logger.info(`Setting up proxy: ${path} -> ${target}`);
 
  app.use(
    path,
    createProxyMiddleware({
      target,
      changeOrigin: true,
      pathRewrite: {
        [`^${path}`]: '',
      },
      onProxyReq: (proxyReq, req, res) => {
        // Forward user information to microservices if authenticated
        if (req.user) {
          proxyReq.setHeader('X-User-ID', req.user.userId);
          proxyReq.setHeader('X-User-Email', req.user.email);
          proxyReq.setHeader('X-User-Role', req.user.role);
        }
        
        // Fix request body for POST/PUT/PATCH requests
        fixRequestBody(proxyReq, req);
      },
      onError: (err, req, res) => {
        logger.error(`Proxy error: ${err.message}`);
        res.status(500).json({
          message: 'Service unavailable',
          error: process.env.NODE_ENV === 'production' ? undefined : err.message
        });
      },
      logProvider: () => logger
    })
  );
});
 
// 404 handler
app.use((req: Request, res: Response) => {
  logger.warn(`Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ message: 'Resource not found' });
});
 
// Error handling middleware
app.use(errorMiddleware);
 
export default app;
 