import mongoose from 'mongoose';

const productImageSchema = new mongoose.Schema(
  {
    storageKey: {
      type: String,
      required: true,
      trim: true,
    },
    contentType: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    data: {
      type: Buffer,
      required: true,
    },
  },
  { timestamps: true }
);

productImageSchema.index({ storageKey: 1 }, { unique: true });

export const ProductImage = mongoose.model('ProductImage', productImageSchema);
