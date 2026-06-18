import mongoose, { Schema, Document } from 'mongoose';

export interface ICachedContent extends Document {
  cacheKey: string;
  version: string;
  content: any;
  contentType: 'api' | 'static' | 'dynamic';
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const CachedContentSchema: Schema = new Schema(
  {
    cacheKey: { type: String, required: true, unique: true },
    version: { type: String, required: true },
    content: { type: Schema.Types.Mixed, required: true },
    contentType: { type: String, enum: ['api', 'static', 'dynamic'], default: 'api' },
    expiresAt: { type: Date }
  },
  { timestamps: true }
);

export default mongoose.model<ICachedContent>('CachedContent', CachedContentSchema);
