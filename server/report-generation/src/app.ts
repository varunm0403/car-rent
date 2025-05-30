import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { connectToDatabase } from './config/database';
import reportRoutes from './routes/reportRoutes';
import { errorHandler } from './middlewares/errorMiddleware';
import logger, { stream } from './utils/logger';
import config from './config/config';

// Initialize express app
const app = express();

// Connect to database
connectToDatabase()
  .then(() => logger.info('Connected to database'))
  .catch((err) => logger.error('Database connection error:', err));

// Security middleware
app.use(helmet());

// CORS setup
app.use(cors({
  origin: config.allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
app.use(morgan('dev', { stream }));

// Serve static files from reports directory
app.use('/reports/files', express.static(path.join(process.cwd(), 'reports/files')));

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    service: 'report-generation',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API routes - directly at root level, without /api prefix
app.use('/reports', reportRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    status: 'error',
    message: `Route not found: ${req.method} ${req.originalUrl}`
  });
});

// Error handling middleware
app.use(errorHandler);

export default app;