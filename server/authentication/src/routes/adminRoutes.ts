import { Router } from 'express';
import { 
  getSupportAgentEmails, 
  addSupportAgentEmail, 
  removeSupportAgentEmail 
} from '../controllers/adminController';
import { authenticate, authorize } from '../middlewares/auth';
import { USER_ROLES } from '../config/constants';

const router = Router();

// All routes require authentication and admin role
router.use(authenticate);
router.use(authorize([USER_ROLES.ADMIN]));

// GET /admin/support-agents - Get all support agent emails
router.get('/support-agents', getSupportAgentEmails);

// POST /admin/support-agents - Add support agent email
router.post('/support-agents', addSupportAgentEmail);

// DELETE /admin/support-agents/:email - Remove support agent email
router.delete('/support-agents/:email', removeSupportAgentEmail);

export default router;