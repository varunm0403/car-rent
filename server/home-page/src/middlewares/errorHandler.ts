import { Request, Response, NextFunction } from 'express';
import logger from '../config/logger';
import { ERROR_MESSAGES } from '../utils/constants/errorMessages';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  logger.error(err.message, { stack: err.stack });
  
  res.status(500).json({
    success: false,
    message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    error: process.env.NODE_ENV === 'production' ? {} : err.message,
  });
};