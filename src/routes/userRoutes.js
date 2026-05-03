import { Router } from 'express';
import { celebrate } from 'celebrate';

import { upload } from '../middleware/multer.js';
import { updateUserSchema } from '../validations/userValidation.js';
import { getUser } from '../controllers/user/getUser.js';
import { authenticate } from '../middleware/authenticete.js';
import { updateAvatar } from '../controllers/user/updateAvatar.js';
import { updateUser } from '../controllers/user/updateUser.js';

const router = Router();

router.get('/users/me', authenticate, getUser);
router.put(
  '/users/avatar',
  authenticate,
  upload.single('avatar'),
  updateAvatar,
);
router.put('/users', authenticate, celebrate(updateUserSchema), updateUser);

export default router;
