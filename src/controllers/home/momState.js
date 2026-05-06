import createHttpError from 'http-errors';

import { MomState } from '../../models/momState.js';

export async function momState(req, res, next) {
  try {
    const { dueDate } = req.user;

    if (!dueDate) {
      throw createHttpError(400, 'No due date provided');
    }

    const requestedWeek = req.query.week ? Number(req.query.week) : null;

    const today = new Date();
    const due = new Date(dueDate);

    const msPerWeek = 1000 * 60 * 60 * 24 * 7;
    const weeksLeft = Math.floor((due - today) / msPerWeek);
    const calculatedWeekNumber = 40 - weeksLeft;

    const weekNumber = requestedWeek || calculatedWeekNumber;

    if (!Number.isFinite(weekNumber) || weekNumber < 1 || weekNumber > 40) {
      throw createHttpError(
        400,
        'Невірна дата пологів або вагітність вже завершена'
      );
    }

    const momState = await MomState.findOne({ weekNumber });

    if (!momState) {
      throw createHttpError(404, `Дані для тижня ${weekNumber} не знайдені`);
    }

    const response = {
      ...momState.toObject(),
      weeksLeft,
    };

    return res.status(200).json(response);
  } catch (error) {
    next(error);
  }
}
