import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { sendErrorResponse } from './responseHelpers';

export const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
): void | Response => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendErrorResponse(res, 'Validation Error', 400, errors.array());
  }
  next();
};