import { Router } from 'express';
import * as carController from '../controllers/carController';

const router = Router();

router.get('/popular', carController.getPopularCars);
router.get('/', carController.getAllCars);
router.get('/:carId', carController.getCarById);

export default router;