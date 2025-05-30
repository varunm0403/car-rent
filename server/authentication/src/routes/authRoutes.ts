import { Router } from 'express';
import { signIn, signUp, validateToken } from '../controllers/authController';
import { signInValidation, signUpValidation, validate } from '../utils/validator';

const router = Router();

// POST /auth/sign-in - User sign-in
router.post('/sign-in', signInValidation, validate, signIn);

// POST /auth/sign-up - User sign-up
router.post('/sign-up', signUpValidation, validate, signUp);

// POST /auth/verify-token - Verify JWT token
router.post('/verify-token', validateToken);

export default router;