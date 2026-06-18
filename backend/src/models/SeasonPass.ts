import mongoose, { Schema, Document } from 'mongoose';

export interface ISeasonPass extends Document {
  seasonId: mongoose.Types.ObjectId;
  levelRequirements: number[]; // e.g., index 0 = level 1 xp req
  freeRewards: Array<{
    level: number;
    xpReward: number;
    coinReward: number;
    storeItemId?: mongoose.Types.ObjectId;
  }>;
  premiumRewards: Array<{
    level: number;
    xpReward: number;
    coinReward: number;
    storeItemId?: mongoose.Types.ObjectId;
  }>;
}

const SeasonPassSchema: Schema = new Schema(
  {
    seasonId: { type: Schema.Types.ObjectId, ref: 'Season', required: true, unique: true },
    levelRequirements: [{ type: Number }], // XP required per level
    freeRewards: [
      {
        level: { type: Number, required: true },
        xpReward: { type: Number, default: 0 },
        coinReward: { type: Number, default: 0 },
        storeItemId: { type: Schema.Types.ObjectId, ref: 'StoreItem' },
      }
    ],
    premiumRewards: [
      {
        level: { type: Number, required: true },
        xpReward: { type: Number, default: 0 },
        coinReward: { type: Number, default: 0 },
        storeItemId: { type: Schema.Types.ObjectId, ref: 'StoreItem' },
      }
    ]
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.SeasonPass || mongoose.model<ISeasonPass>('SeasonPass', SeasonPassSchema);
