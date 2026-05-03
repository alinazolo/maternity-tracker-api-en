import { Router } from 'express';

import { homePublic } from '../controllers/home/homePublic.js';
import { homePrivate } from '../controllers/home/homePrivate.js';
import { authenticate } from '../middleware/authenticete.js';
import { getBabyState } from '../controllers/home/babyState.js';
import { momState } from '../controllers/home/momState.js';

const router = Router();

router.get('/', homePublic);
router.get('/weeks', authenticate, homePrivate);
router.get('/weeks/baby', authenticate, getBabyState);
router.get('/weeks/mom', authenticate, momState);

export default router;
