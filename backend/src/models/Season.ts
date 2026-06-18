import mongoose, { Schema, Document } from 'mongoose';

export interface ISeason extends Document {
  name: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  theme?: string;
}

const SeasonSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
    theme: { type: String },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Season || mongoose.model<ISeason>('Season', SeasonSchema);
