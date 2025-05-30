// src/routes/authRoutes.ts
import { Router } from 'express';
import axios from 'axios';
import { asyncHandler } from '../utils/asyncHandler';
import config from '../config/config';

const router = Router();

router.post('/sign-in', asyncHandler(async (req, res) => {
  const response = await axios.post(`${config.authServiceUrl}/auth/sign-in`, req.body);
  res.status(response.status).json(response.data);
}));

router.post('/sign-up', asyncHandler(async (req, res) => {
  const response = await axios.post(`${config.authServiceUrl}/auth/sign-up`, req.body);
  res.status(response.status).json(response.data);
}));

export default router;