import { Router } from 'express';
import * as aboutUsController from '../controllers/aboutUsController';

const router = Router();

router.get('/', aboutUsController.getAboutUs);

export default router;