import mongoose, { Schema, Document } from 'mongoose';

export interface IEmailLog extends Document {
  to: string;
  subject: string;
  status: 'SENT' | 'FAILED' | 'PENDING';
  error?: string;
  type: string;
  createdAt: Date;
}

const EmailLogSchema: Schema = new Schema(
  {
    to: { type: String, required: true },
    subject: { type: String, required: true },
    status: {
      type: String,
      enum: ['SENT', 'FAILED', 'PENDING'],
      default: 'PENDING',
    },
    error: { type: String },
    type: { type: String, required: true }, // e.g. 'PASSWORD_RESET', 'BATTLE_INVITE', 'DIGEST'
  },
  { timestamps: true }
);

export default mongoose.models.EmailLog || mongoose.model<IEmailLog>('EmailLog', EmailLogSchema);
