import { Schema, model } from 'mongoose';

const subFeelings = new Schema(
  {
    states: {
      type: [String],
      required: true,
    },
    sensationDescr: {
      type: String,
      required: true,
    },
  },
  { timestamps: false, versionKey: false },
);

const subComfortTips = new Schema(
  {
    category: {
      type: String,
      required: true,
    },
    tip: {
      type: String,
      required: true,
    },
  },
  { timestamps: false, versionKey: false },
);

const momStateSchema = new Schema(
  {
    weekNumber: {
      type: Number,
      required: [true, 'Week is required'],
      min: [1, 'Week must be at least 1'],
      max: [42, 'Week must be at most 40'],
      unique: true,
    },
    feelings: {
      type: subFeelings,
      required: [true, 'Feelings description is required'],
    },
    comfortTips: {
      type: [subComfortTips],
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const MomState = model('MomState', momStateSchema);
