import express from 'express';
import {
  generateReport,
  getAllReports,
  getReportById,
  sendReportByEmail,
  generateReportByType,
  downloadReport
} from '../controllers/reportController';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticate);

// Admin-only routes
router.use(authorize(['Admin']));

// Generate report
router.post('/', generateReport);

// Get all reports
router.get('/', getAllReports);

// Get report by ID
router.get('/:id', getReportById);

// Send report by email
router.post('/:id/email', sendReportByEmail);

// Download report
router.get('/:id/download', downloadReport);

// Generate report by type (sales or performance)
router.post('/:type', generateReportByType);

export default router;