// src/utils/jwtHelper.ts
import jwt from 'jsonwebtoken';
import config from '../config/config';

interface TokenPayload {
  sub: string;
  email: string;
  name: string;
  role: string;
  iat?: number;
  exp?: number;
}

export const verifyToken = (token: string): TokenPayload => {
  try {
    // Get JWT_SECRET from environment variables via config
    const secret = process.env.JWT_SECRET || 'your-fallback-secret';
    return jwt.verify(token, secret) as TokenPayload;
  } catch (error) {
    throw error;
  }
};