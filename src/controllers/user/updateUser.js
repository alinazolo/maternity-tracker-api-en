import { User } from '../../models/user.js';
import createHttpError from 'http-errors';

export async function updateUser(req, res) {
  const userId = req.user?._id;
  if (!userId) {
    throw createHttpError(401, 'User not authenticated');
  }
  const { name, gender, dueDate, email } = req.body;

  const updateData = {};
  if (name !== undefined) updateData.name = name;
  if (gender !== undefined) updateData.gender = gender;
  if (dueDate !== undefined) updateData.dueDate = dueDate;
  if (email !== undefined) updateData.email = email;

  const updatedUser = await User.findByIdAndUpdate(
    { _id: userId },
    updateData,
    {
      returnDocument: 'after',
    },
  );

  if (!updatedUser) {
    throw createHttpError(404, 'User not found');
  }

  res.status(200).json(updatedUser);
}
