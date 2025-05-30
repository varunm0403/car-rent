// src/middlewares/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import { verifyToken } from '../utils/jwtHelper';
import { ApiError } from '../utils/apiErrors';
import config from '../config/config';
import { logger } from '../utils/logger';

// Define interfaces for the response from auth service
interface TokenVerificationResponse {
  valid: boolean;
  message?: string;
  user?: {
    userId: string;
    email: string;
    name: string;
    role: string;
  };
}

// Interface for axios response
interface AxiosResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: any;
  config: any;
  request?: any;
}

// Interface for axios error
interface AxiosErrorResponse {
  response?: {
    data?: any;
    status?: number;
    headers?: any;
  };
  request?: any;
  message: string;
  config?: any;
  isAxiosError?: boolean;
}

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
        name: string;
        role: string;
      };
    }
  }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError(401, 'No token provided');
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verify token locally
    try {
      const decoded = verifyToken(token);
      
      // Add user to request
      req.user = {
        userId: decoded.sub,
        email: decoded.email,
        name: decoded.name,
        role: decoded.role
      };
      
      next();
    } catch (tokenError) {
      // If local verification fails, try to validate with auth service
      try {
        const response = await axios.post(
          `${config.services.authServiceUrl}/auth/verify-token`,
          { token },
          { headers: { 'Content-Type': 'application/json' } }
        );
        
        const data = response.data as TokenVerificationResponse;
        
        if (data && data.valid && data.user) {
          req.user = {
            userId: data.user.userId,
            email: data.user.email,
            name: data.user.name,
            role: data.user.role
          };
          next();
        } else {
          throw new ApiError(401, data.message || 'Invalid token');
        }
      } catch (error) {
        const authServiceError = error as AxiosErrorResponse;
        logger.error(`Token validation error: ${authServiceError.message}`);
        throw new ApiError(401, 'Invalid or expired token');
      }
    }
  } catch (error) {
    next(error);
  }
};

export const authorize = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new ApiError(401, 'Not authenticated'));
      return;
    }
    
    if (!roles.includes(req.user.role)) {
      next(new ApiError(403, 'Not authorized to access this resource'));
      return;
    }
    
    next();
  };
};