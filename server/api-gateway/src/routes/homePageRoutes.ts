// src/routes/homePageRoutes.ts
import { Router } from 'express';
import axios from 'axios';
import { asyncHandler } from '../utils/asyncHandler';
import config from '../config/config';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

// Public routes don't need authentication
router.get('/', asyncHandler(async (req, res) => {
  const response = await axios.get(`${config.homePageServiceUrl}/`);
  res.status(response.status).json(response.data);
}));

// Protected routes use the authenticate middleware
router.get('/user-specific-data', authenticate, asyncHandler(async (req, res) => {
  // Forward the user information to the home page service
  const response = await axios.get(
    `${config.homePageServiceUrl}/user-specific-data`,
    {
      headers: {
        'X-User-ID': req.user?.userId,
        'X-User-Email': req.user?.email,
        'X-User-Role': req.user?.role
      }
    }
  );
  res.status(response.status).json(response.data);
}));

export default router;