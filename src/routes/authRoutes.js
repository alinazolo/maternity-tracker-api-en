import { Router } from 'express';
import { celebrate } from 'celebrate';

import {
  registerUserSchema,
  loginUserSchema,
} from '../validations/authValidation.js';
import { authenticate } from '../middleware/authenticete.js';
import { registerUser } from '../controllers/auth/registerUser.js';
import { loginUser } from '../controllers/auth/loginUser.js';
import { logoutUser } from '../controllers/auth/logoutUser.js';
import { refreshUser } from '../controllers/auth/refreshUser.js';

const router = Router();

router.post('/auth/register', celebrate(registerUserSchema), registerUser);
router.post('/auth/login', celebrate(loginUserSchema), loginUser);
router.post('/auth/logout', authenticate, logoutUser);
router.post('/auth/refresh', refreshUser);

export default router;
