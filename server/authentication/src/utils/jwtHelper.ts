// src/utils/jwtHelper.ts
import jwt, { SignOptions, Secret } from 'jsonwebtoken';
import { StringValue } from 'ms';
import { logger } from './logger';

export interface TokenPayload {
  sub: string;
  email: string;
  name: string;
  role: string;
}

export const generateToken = (payload: TokenPayload): string => {
  try {
    const secret: Secret = process.env.JWT_SECRET || 'your_jwt_secret_key';
    
    // Now we can properly type the expiresIn value
    const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
    const options: SignOptions = { 
      expiresIn: expiresIn as StringValue
    };
    
    return jwt.sign(payload, secret, options);
  } catch (error: any) {
    logger.error(`Error generating JWT token: ${error.message}`);
    throw new Error('Error generating authentication token');
  }
};

export const verifyToken = (token: string): TokenPayload => {
  try {
    const secret: Secret = process.env.JWT_SECRET || 'your_jwt_secret_key';
    return jwt.verify(token, secret) as TokenPayload;
  } catch (error: any) {
    logger.error(`Error verifying JWT token: ${error.message}`);
    throw error;
  }
};