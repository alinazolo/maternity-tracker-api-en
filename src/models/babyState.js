import { Schema, model } from 'mongoose';

const babyStateSchema = new Schema(
  {
    analogy: {
      type: String,
      required: true,
    },
    weekNumber: {
      type: Number,
      required: true,
      min: 1,
      max: 42,
      unique: true,
    },
    babySize: {
      type: Number,
      required: true,
    },
    babyWeight: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    babyActivity: {
      type: String,
      required: true,
    },
    babyDevelopment: {
      type: String,
      required: true,
    },
    interestingFact: {
      type: String,
      required: true,
    },
    momDailyTips: {
      type: [String],
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const BabyState = model('BabyState', babyStateSchema);
