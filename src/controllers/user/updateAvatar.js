import { User } from '../../models/user.js';
import { saveFileToCloudinary } from '../../utils/saveFileToCloudinary.js';
import createHttpError from 'http-errors';

export const updateAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      throw createHttpError(400, 'No file uploaded');
    }
    if (!req.file.mimetype.startsWith('image/')) {
      throw createHttpError(400, 'Uploaded file is not an image');
    }
    const result = await saveFileToCloudinary(req.file.buffer);
    if (!result) {
      throw createHttpError(500, 'Error of upload avatar...');
    }
    const user = await User.findOneAndUpdate(
      { _id: req.user._id },
      { avatar: result.secure_url },
      { returnDocument: 'after' },
    );
    res.status(200).json({ url: user.avatar });
  } catch (error) {
    next(error);
  }
};
