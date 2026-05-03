import { Router } from 'express';
import { authenticate } from '../middleware/authenticete.js';
import { getAllEmotions } from '../controllers/emotion/emotionController.js';

const router = Router();

router.get('/emotions', authenticate, getAllEmotions);

export default router;
