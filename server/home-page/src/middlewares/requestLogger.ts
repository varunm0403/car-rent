import { Request, Response, NextFunction } from 'express';
import logger from '../config/logger';

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  logger.info(`${req.method} ${req.path}`, {
    query: req.query,
    params: req.params,
    ip: req.ip,
  });
  next();
};