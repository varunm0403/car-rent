import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwtHelper';
import User from '../models/User';
import { logger } from '../utils/logger';

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
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
      res.status(401).json({ message: 'No token provided' });
      return;
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verify token
    const decoded = verifyToken(token);
    
    // Find user
    const user = await User.findById(decoded.sub);
    
    if (!user) {
      res.status(401).json({ message: 'User not found' });
      return;
    }
    
    // Add user to request
    req.user = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role
    };
    
    next();
  } catch (error: any) {
    logger.error(`Authentication error: ${error.message}`);
    
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      res.status(401).json({ message: 'Invalid or expired token' });
      return;
    }
    
    res.status(500).json({ message: 'Authentication error' });
  }
};

export const authorize = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }
    
    if (!roles.includes(req.user.role)) {
      res.status(403).json({ message: 'Not authorized to access this resource' });
      return;
    }
    
    next();
  };
};