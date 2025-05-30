import { Router } from 'express';
import * as homeController from '../controllers/homeController';
// import * as feedbackController from '../controllers/feedbackController';

const router = Router();

router.get('/', homeController.getHomePageData);
// router.get('/feedbacks/recent', feedbackController.getRecentFeedbacks);

export default router;