// src/middlewares/errorMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import { ApiError, handleError } from '../utils/apiErrors';
import logger from '../utils/logger';

export const errorHandler = (
  err: Error | ApiError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Log error
  logger.error(`${req.method} ${req.path} - ${err.message}`);
  if (err.stack) {
    logger.error(err.stack);
  }

  // Handle ApiError
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
    return;
  }

  // Handle other errors
  const statusCode = 500;
  res.status(statusCode).json({
    status: 'error',
    message: 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

// Export ApiError to be used elsewhere
export { ApiError };