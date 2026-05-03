import { Task } from '../../models/task.js';

export async function createTask(req, res) {
  try {
    const { title, date } = req.body;

    const task = await Task.create({
      title,
      date,
      owner: req.user._id,
    });

    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
