import createHttpError from 'http-errors';

import { BabyState } from '../../models/babyState.js';

export async function homePublic(req, res) {
  const currentWeek = 1;
  const daysLeft = 280;

  const baby = await BabyState.findOne({ weekNumber: currentWeek });
  if (!baby) {
    throw createHttpError(404, 'Baby state not found');
  }

  const babySize = baby.babySize;
  const babyWeight = baby.babyWeight;
  const image = baby.image;
  const babyActivity = baby.babyActivity;
  const babyDevelopment = baby.babyDevelopment;
  const momDailyTips = baby.momDailyTips?.[0] || 'Порада не знайдена';

  const babyState = {
    babySize,
    babyWeight,
    image,
    babyActivity,
    babyDevelopment,
    momDailyTips,
  };

  res.status(200).json({ currentWeek, daysLeft, babyState });
}
