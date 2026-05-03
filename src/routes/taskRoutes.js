import { Router } from 'express';
import { celebrate } from 'celebrate';

import {
  createTaskSchema,
  updateStatusTaskSchema,
} from '../validations/taskValidation.js';
import { authenticate } from '../middleware/authenticete.js';
import { createTask } from '../controllers/task/createTask.js';
import { getTasks } from '../controllers/task/getTasks.js';
import { updateTaskStatus } from '../controllers/task/updateTaskStatus.js';

const router = Router();

router.use('/tasks', authenticate);

router.get('/tasks', getTasks);
router.post('/tasks', celebrate(createTaskSchema), createTask);
router.patch(
  '/tasks/:taskId',
  celebrate(updateStatusTaskSchema),
  updateTaskStatus,
);

export default router;
