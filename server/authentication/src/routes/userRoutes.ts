import { Router } from 'express';
import { 
  getUserProfile, 
  updatePersonalInfo, 
  changePassword,
  getAllUsers,
  getClients,
  getSupportAgents,
  updateUserRole
} from '../controllers/userController';
import { authenticate, authorize } from '../middlewares/auth';
import { updatePersonalInfoValidation, changePasswordValidation, validate } from '../utils/validator';
import { USER_ROLES } from '../config/constants';

const router = Router();

// All routes require authentication
router.use(authenticate);

// GET /users/profile - Get user profile
router.get('/profile', getUserProfile);

// PUT /users/profile - Update personal information
router.put('/profile', updatePersonalInfoValidation, validate, updatePersonalInfo);

// PUT /users/password - Change password
router.put('/password', changePasswordValidation, validate, changePassword);

// Routes that require admin role
router.get('/', authorize([USER_ROLES.ADMIN]), getAllUsers);
router.get('/clients', authorize([USER_ROLES.ADMIN]), getClients);
router.get('/agents', authorize([USER_ROLES.ADMIN]), getSupportAgents);
router.put('/:userId/role', authorize([USER_ROLES.ADMIN]), updateUserRole);

export default router;