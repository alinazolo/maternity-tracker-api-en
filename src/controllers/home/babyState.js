import { BabyState } from '../../models/babyState.js';
import { getCurrentWeek, daysLeft } from '../../services/term.js';

export const getBabyState = async (req, res, next) => {
  try {
    const user = req.user;

    if (!user || !user.dueDate) {
      return res.status(400).json({
        message: 'No due date provided',
      });
    }

    const requestedWeek = req.query.week ? Number(req.query.week) : null;

    const currentWeek =
      requestedWeek || getCurrentWeek(new Date(user.dueDate));

    const babyState = await BabyState.findOne({
      weekNumber: currentWeek,
    });

    if (!babyState) {
      return res.status(404).json({
        message: 'Baby state not found',
      });
    }

    const daysLeftTo = daysLeft(new Date(user.dueDate));

    const currentDayOfWeekRaw =
      280 - daysLeftTo - (currentWeek - 1) * 7;

    const currentDayOfWeek = Math.min(
      Math.max(currentDayOfWeekRaw, 0),
      babyState.momDailyTips.length - 1,
    );

    const currentMomDailyTips =
      babyState.momDailyTips[currentDayOfWeek] ||
      'Порада не знайдена';

    const response = {
      ...babyState.toObject(),
      momDailyTips: currentMomDailyTips,
      daysLeftTo
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
