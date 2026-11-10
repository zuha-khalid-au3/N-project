import mongoose from 'mongoose';

const productImageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    storageKey: { type: String, required: true },
    altText: { type: String, default: '' },
    sortOrder: { type: Number, default: 0 },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, lowercase: true, trim: true },
    sku: { type: String, trim: true },
    category: { type: String, required: true, trim: true },
    material: { type: String, default: '', trim: true },
    color: { type: String, default: '', trim: true },
    shape: { type: String, default: '', trim: true },
    size: { type: String, default: '', trim: true },
    finish: { type: String, default: '', trim: true },
    description: { type: String, required: true, trim: true },
    moq: { type: String, default: '', trim: true },
    priceLabel: { type: String, default: 'Contact for quotation', trim: true },
    stockStatus: {
      type: String,
      enum: ['in_stock', 'made_to_order', 'out_of_stock'],
      default: 'made_to_order',
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'hidden'],
      default: 'draft',
    },
    featured: { type: Boolean, default: false },
    images: { type: [productImageSchema], default: [] },
    seo: {
      title: { type: String, default: '' },
      description: { type: String, default: '' },
    },
    publishedAt: { type: Date },
  },
  { timestamps: true }
);

productSchema.index({ slug: 1 }, { unique: true });
productSchema.index({ sku: 1 }, { unique: true, sparse: true });
productSchema.index({ status: 1 });
productSchema.index({ featured: 1 });
productSchema.index({ category: 1 });
productSchema.index({ createdAt: -1 });
productSchema.index({
  name: 'text',
  description: 'text',
  category: 'text',
  color: 'text',
  material: 'text',
});

export const Product = mongoose.model('Product', productSchema);
