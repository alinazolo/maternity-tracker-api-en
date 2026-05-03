import createHttpError from 'http-errors';
import { Task } from '../../models/task.js';

export async function updateTaskStatus(req, res) {
  const { taskId } = req.params;
  const oldTask = await Task.findOne({ _id: taskId, owner: req.user._id });
  if (!oldTask) {
    throw createHttpError(404, 'Task not found');
  }
  const status = oldTask.isDone ? false : true;

  const task = await Task.findOneAndUpdate(
    { _id: taskId, owner: req.user._id },
    { isDone: status },
    { returnDocument: 'after' },
  );

  if (!task) {
    throw createHttpError(404, 'Task not found');
  }

  res.status(200).json(task);
}
