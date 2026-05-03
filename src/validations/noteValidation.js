import { Joi, Segments } from 'celebrate';
import { isValidObjectId } from 'mongoose';

const objectIdValidator = (value, helpers) => {
  return !isValidObjectId(value) ? helpers.message('Invalid id format') : value;
};

export const createNoteSchema = {
  [Segments.BODY]: Joi.object({
    title: Joi.string().min(1).max(64).required(),
    description: Joi.string().min(1).max(1000).required(),
    emotions: Joi.array()
      .items(Joi.string().custom(objectIdValidator))
      .min(1)
      .max(12)
      .required(),
  }),
};

export const updateNoteSchema = {
  [Segments.BODY]: Joi.object({
    title: Joi.string().min(1).max(64).required(),
    description: Joi.string().min(1).max(1000).required(),
    emotions: Joi.array()
      .items(Joi.string().custom(objectIdValidator))
      .min(1)
      .max(12)
      .required(),
  }),
  [Segments.PARAMS]: Joi.object({
    noteId: Joi.string().custom(objectIdValidator).required(),
  }),
};

export const deleteNoteSchema = {
  [Segments.PARAMS]: Joi.object({
    noteId: Joi.string().custom(objectIdValidator).required(),
  }),
};

export const getNoteSchema = {
  [Segments.PARAMS]: Joi.object({
    noteId: Joi.string().custom(objectIdValidator).required(),
  }),
};
