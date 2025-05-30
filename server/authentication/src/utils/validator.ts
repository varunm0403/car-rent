import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

// Validation schemas
export const signUpValidation = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/\d/)
    .withMessage('Password must contain at least one number'),
  body('firstName')
    .notEmpty()
    .withMessage('First name is required')
    .trim(),
  body('lastName')
    .notEmpty()
    .withMessage('Last name is required')
    .trim(),
  body('phoneNumber')
    .optional()
    .isMobilePhone('any')
    .withMessage('Please provide a valid phone number'),
  body('country')
    .optional()
    .trim(),
  body('city')
    .optional()
    .trim(),
  body('street')
    .optional()
    .trim(),
  body('postalCode')
    .optional()
    .trim()
];

export const signInValidation = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

export const updatePersonalInfoValidation = [
  body('firstName')
    .optional()
    .notEmpty()
    .withMessage('First name cannot be empty')
    .trim(),
  body('lastName')
    .optional()
    .notEmpty()
    .withMessage('Last name cannot be empty')
    .trim(),
  body('phoneNumber')
    .optional()
    .isMobilePhone('any')
    .withMessage('Please provide a valid phone number'),
  body('country')
    .optional()
    .trim(),
  body('city')
    .optional()
    .trim(),
  body('street')
    .optional()
    .trim(),
  body('postalCode')
    .optional()
    .trim()
];

export const changePasswordValidation = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters long')
    .matches(/\d/)
    .withMessage('New password must contain at least one number')
];

// Validation middleware
export const validate = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ 
      message: 'Validation error', 
      errors: errors.array() 
    });
    return;
  }
  next();
};