import { Router } from 'express';
import * as faqController from '../controllers/faqController';

const router = Router();

router.get('/', faqController.getFAQs);

export default router;