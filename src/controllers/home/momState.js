import createHttpError from 'http-errors';

import { MomState } from '../../models/momState.js';

export async function momState(req, res) {
  try {
    const { dueDate } = req.user;
    const today = new Date();
    const due = new Date(dueDate);

    const msPerWeek = 1000 * 60 * 60 * 24 * 7;
    const weeksLeft = Math.floor((due - today) / msPerWeek);
    const weekNumber = 40 - weeksLeft;
    if (weekNumber < 1 || weekNumber > 40) {
      throw createHttpError(
        400,
        'Невірна дата пологів або вагітність вже завершена',
      );
    }
    const momState = await MomState.findOne({ weekNumber });

    if (!momState) {
      throw createHttpError(404, `Дані для тижня ${weekNumber} не знайдені`);
    }
    return res.status(200).json(momState);
  } catch (error) {
    console.error('momState error:', error);
    throw createHttpError(500, 'Серверна помилка');
  }
}
