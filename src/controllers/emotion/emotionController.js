import { Emotion } from '../../models/emotion.js';
import createHttpError from 'http-errors';

export async function getAllEmotions(req, res) {
  const emotions = await Emotion.find();
  if (!emotions) {
    throw createHttpError(404, 'Emotions not found');
  }
  res.status(200).json({ emotions });
}
