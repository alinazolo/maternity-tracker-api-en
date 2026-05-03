import { isValidObjectId } from 'mongoose';

export function validatorId(value, helpers) {
  return !isValidObjectId(value) ? helpers.message('Invalid id format') : value;
}
