import { Response } from 'express';
import { ERROR_MESSAGES } from '../constants/errorMessages';

export const sendSuccessResponse = (
  res: Response,
  data: any,
  message: string,
  statusCode: number = 200
): void => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const sendErrorResponse = (
  res: Response,
  message: string = ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
  statusCode: number = 500,
  errors: any = null
): void => {
  const response: any = {
    success: false,
    message,
  };

  if (errors) {
    response.errors = errors;
  }

  res.status(statusCode).json(response);
};