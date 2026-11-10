import { z } from 'zod';

const stockStatus = z.enum(['in_stock', 'made_to_order', 'out_of_stock']);
const productStatus = z.enum(['draft', 'published', 'hidden']);

const imageUrlSchema = z
  .string()
  .min(1)
  .refine(
    (value) =>
      value.startsWith('/uploads/') ||
      value.startsWith('http://') ||
      value.startsWith('https://'),
    { message: 'Invalid image url' }
  );

const imageSchema = z.object({
  url: imageUrlSchema,
  storageKey: z.string().min(1),
  altText: z.string().max(200).optional().default(''),
  sortOrder: z.number().int().min(0).optional().default(0),
});

export const productBodySchema = z.object({
  name: z.string().min(2).max(160),
  sku: z.string().max(80).optional().or(z.literal('')),
  category: z.string().min(2).max(80),
  material: z.string().max(80).optional().default(''),
  color: z.string().max(80).optional().default(''),
  shape: z.string().max(80).optional().default(''),
  size: z.string().max(80).optional().default(''),
  finish: z.string().max(80).optional().default(''),
  description: z.string().min(10).max(5000),
  moq: z.string().max(80).optional().default(''),
  priceLabel: z.string().max(120).optional().default('Contact for quotation'),
  stockStatus: stockStatus.optional().default('made_to_order'),
  status: productStatus.optional().default('draft'),
  featured: z.boolean().optional().default(false),
  images: z.array(imageSchema).max(8).optional().default([]),
  seo: z
    .object({
      title: z.string().max(160).optional().default(''),
      description: z.string().max(320).optional().default(''),
    })
    .optional()
    .default({ title: '', description: '' }),
});

export const productUpdateSchema = productBodySchema.partial();

export const publicProductQuerySchema = z.object({
  q: z.string().optional().default(''),
  category: z.string().optional().default(''),
  color: z.string().optional().default(''),
  shape: z.string().optional().default(''),
  material: z.string().optional().default(''),
  stockStatus: z.string().optional().default(''),
  featured: z.string().optional().default(''),
  sort: z.enum(['newest', 'name', 'featured']).optional().default('newest'),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(48).optional().default(12),
});

export const adminProductQuerySchema = z.object({
  q: z.string().optional().default(''),
  status: z.string().optional().default(''),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
});
