import { Joi, Segments } from 'celebrate';
import { GENDER } from '../constatnts/gender.js';

export const updateUserSchema = {
  [Segments.BODY]: Joi.object({
    name: Joi.string().max(32),
    email: Joi.string().email().max(64),
    gender: Joi.string().valid(...GENDER),
    dueDate: Joi.string()
      .pattern(/^\d{4}-\d{2}-\d{2}$/)
      .custom((value, helpers) => {
        const today = new Date();

        const minDate = new Date();
        minDate.setDate(today.getDate() + 7);

        const maxDate = new Date();
        maxDate.setDate(today.getDate() + 40 * 7);

        const inputDate = new Date(value);

        if (inputDate < minDate) {
          return helpers.message('dueDate must be at least 1 week from today');
        }

        if (inputDate > maxDate) {
          return helpers.message('dueDate must be within 40 weeks');
        }

        return value;
      }),
  }).min(1),
};
