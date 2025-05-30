// src/utils/jwtHelper.ts
import jwt from 'jsonwebtoken';
import config from '../config/config';
import { ApiError } from './apiErrors';

interface JwtPayload {
  sub: string;
  email: string;
  name: string;
  role: string;
  iat?: number;
  exp?: number;
}

export const verifyToken = (token: string): JwtPayload => {
  try {
    const decoded = jwt.verify(token, config.jwtSecret) as JwtPayload;
    return decoded;
  } catch (error) {
    throw new ApiError(401, 'Invalid or expired token');
  }
};