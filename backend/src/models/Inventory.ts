import mongoose, { Schema, Document } from 'mongoose';

export interface IInventory extends Document {
  userId: mongoose.Types.ObjectId;
  items: Array<{
    storeItemId: mongoose.Types.ObjectId;
    acquiredAt: Date;
  }>;
  equippedTitle?: mongoose.Types.ObjectId;
  equippedFrame?: mongoose.Types.ObjectId;
  equippedTheme?: mongoose.Types.ObjectId;
}

const InventorySchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    items: [
      {
        storeItemId: { type: Schema.Types.ObjectId, ref: 'StoreItem', required: true },
        acquiredAt: { type: Date, default: Date.now }
      }
    ],
    equippedTitle: { type: Schema.Types.ObjectId, ref: 'StoreItem' },
    equippedFrame: { type: Schema.Types.ObjectId, ref: 'StoreItem' },
    equippedTheme: { type: Schema.Types.ObjectId, ref: 'StoreItem' },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Inventory || mongoose.model<IInventory>('Inventory', InventorySchema);
