import slugify from 'slugify';
import { Product } from '../models/Product.js';
import { deleteStoredObject } from './storageService.js';

async function uniqueSlug(name, excludeId) {
  const base = slugify(name, { lower: true, strict: true }) || 'product';
  let candidate = base;
  let counter = 1;

  while (true) {
    const existing = await Product.findOne({
      slug: candidate,
      ...(excludeId ? { _id: { $ne: excludeId } } : {}),
    }).select('_id');
    if (!existing) return candidate;
    counter += 1;
    candidate = `${base}-${counter}`;
  }
}

function publicProjection() {
  return {
    name: 1,
    slug: 1,
    sku: 1,
    category: 1,
    material: 1,
    color: 1,
    shape: 1,
    size: 1,
    finish: 1,
    description: 1,
    moq: 1,
    priceLabel: 1,
    stockStatus: 1,
    featured: 1,
    images: 1,
    seo: 1,
    publishedAt: 1,
    createdAt: 1,
    updatedAt: 1,
  };
}

export async function listPublicProducts(query) {
  const filter = { status: 'published' };

  if (query.category) filter.category = query.category;
  if (query.color) filter.color = query.color;
  if (query.shape) filter.shape = query.shape;
  if (query.material) filter.material = query.material;
  if (query.stockStatus) filter.stockStatus = query.stockStatus;
  if (query.featured === 'true') filter.featured = true;

  if (query.q) {
    filter.$text = { $search: query.q };
  }

  let sort = { createdAt: -1 };
  if (query.sort === 'name') sort = { name: 1 };
  if (query.sort === 'featured') sort = { featured: -1, createdAt: -1 };

  const skip = (query.page - 1) * query.limit;
  const [items, total] = await Promise.all([
    Product.find(filter).select(publicProjection()).sort(sort).skip(skip).limit(query.limit).lean(),
    Product.countDocuments(filter),
  ]);

  return {
    items,
    pagination: {
      page: query.page,
      limit: query.limit,
      total,
      pages: Math.max(1, Math.ceil(total / query.limit)),
    },
  };
}

export async function listFeaturedProducts(limit = 8) {
  return Product.find({ status: 'published', featured: true })
    .select(publicProjection())
    .sort({ publishedAt: -1, createdAt: -1 })
    .limit(limit)
    .lean();
}

export async function getPublicProductBySlug(slug) {
  return Product.findOne({ slug, status: 'published' }).select(publicProjection()).lean();
}

export async function getRelatedProducts(product, limit = 4) {
  return Product.find({
    status: 'published',
    category: product.category,
    _id: { $ne: product._id },
  })
    .select(publicProjection())
    .sort({ featured: -1, createdAt: -1 })
    .limit(limit)
    .lean();
}

export async function getFilterOptions() {
  const [categories, colors, shapes, materials, stockStatuses] = await Promise.all([
    Product.distinct('category', { status: 'published' }),
    Product.distinct('color', { status: 'published', color: { $ne: '' } }),
    Product.distinct('shape', { status: 'published', shape: { $ne: '' } }),
    Product.distinct('material', { status: 'published', material: { $ne: '' } }),
    Product.distinct('stockStatus', { status: 'published' }),
  ]);

  return { categories, colors, shapes, materials, stockStatuses };
}

export async function getAdminStats() {
  const [total, published, draft, hidden] = await Promise.all([
    Product.countDocuments(),
    Product.countDocuments({ status: 'published' }),
    Product.countDocuments({ status: 'draft' }),
    Product.countDocuments({ status: 'hidden' }),
  ]);
  return { total, published, draft, hidden };
}

export async function listAdminProducts(query) {
  const filter = {};
  if (query.status) filter.status = query.status;
  if (query.q) {
    filter.$or = [
      { name: new RegExp(query.q, 'i') },
      { sku: new RegExp(query.q, 'i') },
      { category: new RegExp(query.q, 'i') },
    ];
  }

  const skip = (query.page - 1) * query.limit;
  const [items, total] = await Promise.all([
    Product.find(filter).sort({ updatedAt: -1 }).skip(skip).limit(query.limit).lean(),
    Product.countDocuments(filter),
  ]);

  return {
    items,
    pagination: {
      page: query.page,
      limit: query.limit,
      total,
      pages: Math.max(1, Math.ceil(total / query.limit)),
    },
  };
}

export async function getAdminProductById(id) {
  return Product.findById(id).lean();
}

export async function createProduct(payload) {
  const slug = await uniqueSlug(payload.name);
  const images = (payload.images || []).slice(0, 8).map((image, index) => ({
    ...image,
    sortOrder: image.sortOrder ?? index,
    altText: image.altText || payload.name,
  }));

  const doc = {
    ...payload,
    sku: payload.sku || undefined,
    slug,
    images,
    publishedAt: payload.status === 'published' ? new Date() : undefined,
  };

  return Product.create(doc);
}

export async function updateProduct(id, payload) {
  const existing = await Product.findById(id);
  if (!existing) return null;

  if (payload.name && payload.name !== existing.name) {
    existing.slug = await uniqueSlug(payload.name, existing._id);
    existing.name = payload.name;
  }

  const fields = [
    'sku',
    'category',
    'material',
    'color',
    'shape',
    'size',
    'finish',
    'description',
    'moq',
    'priceLabel',
    'stockStatus',
    'status',
    'featured',
    'seo',
  ];

  for (const field of fields) {
    if (payload[field] !== undefined) {
      existing[field] = payload[field] === '' && field === 'sku' ? undefined : payload[field];
    }
  }

  if (payload.images) {
    const previousKeys = new Set(existing.images.map((img) => img.storageKey));
    const nextImages = payload.images.slice(0, 8).map((image, index) => ({
      ...image,
      sortOrder: image.sortOrder ?? index,
      altText: image.altText || existing.name,
    }));
    const nextKeys = new Set(nextImages.map((img) => img.storageKey));

    for (const key of previousKeys) {
      if (!nextKeys.has(key)) {
        await deleteStoredObject(key);
      }
    }
    existing.images = nextImages;
  }

  if (payload.status === 'published' && existing.status !== 'published') {
    existing.publishedAt = new Date();
  }
  if (payload.status && payload.status !== 'published') {
    // keep publishedAt history if previously published
  }

  await existing.save();
  return existing.toObject();
}

export async function deleteProduct(id) {
  const product = await Product.findById(id);
  if (!product) return null;

  for (const image of product.images) {
    await deleteStoredObject(image.storageKey);
  }

  await product.deleteOne();
  return true;
}

export async function setProductStatus(id, status) {
  const product = await Product.findById(id);
  if (!product) return null;

  product.status = status;
  if (status === 'published') {
    product.publishedAt = product.publishedAt || new Date();
  }
  await product.save();
  return product.toObject();
}
