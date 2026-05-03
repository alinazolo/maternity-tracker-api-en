import { BabyState } from '../../models/babyState.js';
import { getCurrentWeek, daysLeft } from '../../services/term.js';

export const getBabyState = async (req, res, next) => {
  try {
    const user = req.user;

    if (!user || !user.dueDate) {
      return res.status(400).json({ message: 'No due date provided' });
    }

    const currentWeek = getCurrentWeek(new Date(user.dueDate));
    const daysLeftTo = daysLeft(new Date(user.dueDate));
    const currentDayOfWeek = 280 - daysLeftTo - (currentWeek - 1) * 7;

    const babyState = await BabyState.findOne({ weekNumber: currentWeek });
    if (!babyState) {
      return res.status(404).json({ message: 'Baby state not found' });
    }

    const currentMomDailyTips =
      babyState.momDailyTips[currentDayOfWeek] || 'Порада не знайдена';
    babyState.momDailyTips = currentMomDailyTips;

    res.status(200).json(babyState);
  } catch (error) {
    next(error);
  }
};
