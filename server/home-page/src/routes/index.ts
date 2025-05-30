import { Router } from 'express';
import homeRoutes from './homeRoutes';
import aboutUsRoutes from './aboutUsRoutes';
import faqRoutes from './faqRoutes';
import locationRoutes from './locationRoutes';
import carRoutes from './carRoutes';

const router = Router();

router.use('/home', homeRoutes);
router.use('/about-us', aboutUsRoutes);
router.use('/faqs', faqRoutes);
router.use('/locations', locationRoutes);
router.use('/cars', carRoutes);

export default router;