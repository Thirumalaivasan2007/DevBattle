import mongoose, { Schema, Document } from 'mongoose';

export enum StoreItemType {
  TITLE = 'TITLE',
  FRAME = 'FRAME',
  THEME = 'THEME',
  BADGE = 'BADGE'
}

export enum StoreItemRarity {
  COMMON = 'COMMON',
  RARE = 'RARE',
  EPIC = 'EPIC',
  LEGENDARY = 'LEGENDARY'
}

export interface IStoreItem extends Document {
  name: string;
  type: StoreItemType;
  price: number;
  description: string;
  image?: string;
  rarity: StoreItemRarity;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const StoreItemSchema: Schema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    type: { type: String, enum: Object.values(StoreItemType), required: true },
    price: { type: Number, required: true, min: 0 },
    description: { type: String, required: true },
    image: { type: String },
    rarity: { type: String, enum: Object.values(StoreItemRarity), default: StoreItemRarity.COMMON },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.StoreItem || mongoose.model<IStoreItem>('StoreItem', StoreItemSchema);
