import { z } from 'zod';

const stockStatus = z.enum(['in_stock', 'made_to_order', 'out_of_stock'], {
  errorMap: () => ({ message: 'Choose a valid stock status' }),
});
const productStatus = z.enum(['draft', 'published', 'hidden'], {
  errorMap: () => ({ message: 'Choose draft, published, or hidden' }),
});

const imageUrlSchema = z
  .string({ required_error: 'Image URL is required' })
  .min(1, 'Image URL is required')
  .refine(
    (value) =>
      value.startsWith('/uploads/') ||
      value.startsWith('http://') ||
      value.startsWith('https://'),
    { message: 'Image URL must be an uploaded file path or a full http(s) link' }
  );

const imageSchema = z.object({
  url: imageUrlSchema,
  storageKey: z.string({ required_error: 'Image file key is missing' }).min(1, 'Image file key is missing'),
  altText: z.string().max(200, 'Alt text must be 200 characters or less').optional().default(''),
  sortOrder: z.number().int().min(0).optional().default(0),
});

const productFieldsSchema = z.object({
  name: z
    .string({ required_error: 'Product name is required' })
    .trim()
    .min(2, 'Product name must be at least 2 characters')
    .max(160, 'Product name must be 160 characters or less'),
  sku: z
    .string()
    .trim()
    .max(80, 'SKU must be 80 characters or less')
    .optional()
    .or(z.literal('')),
  category: z
    .string({ required_error: 'Category is required' })
    .trim()
    .min(2, 'Select a category')
    .max(80, 'Category must be 80 characters or less'),
  material: z.string().max(80, 'Material must be 80 characters or less').optional().default(''),
  color: z.string().max(80, 'Colour must be 80 characters or less').optional().default(''),
  shape: z.string().max(80, 'Shape must be 80 characters or less').optional().default(''),
  size: z.string().max(80, 'Size must be 80 characters or less').optional().default(''),
  finish: z.string().max(80, 'Finish must be 80 characters or less').optional().default(''),
  description: z
    .string({ required_error: 'Description is required' })
    .trim()
    .min(10, 'Description must be at least 10 characters')
    .max(5000, 'Description must be 5000 characters or less'),
  moq: z.string().max(80, 'MOQ must be 80 characters or less').optional().default(''),
  priceLabel: z
    .string()
    .max(120, 'Price label must be 120 characters or less')
    .optional()
    .default('Contact for quotation'),
  stockStatus: stockStatus.optional().default('made_to_order'),
  status: productStatus.optional().default('draft'),
  featured: z.boolean().optional().default(false),
  images: z.array(imageSchema).max(8, 'Maximum 8 images per product').optional().default([]),
  seo: z
    .object({
      title: z.string().max(160, 'SEO title must be 160 characters or less').optional().default(''),
      description: z
        .string()
        .max(320, 'SEO description must be 320 characters or less')
        .optional()
        .default(''),
    })
    .optional()
    .default({ title: '', description: '' }),
});

function requireImagesWhenPublishing(data, ctx) {
  if (data.status === 'published' && Array.isArray(data.images) && data.images.length === 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['images'],
      message: 'Add at least one image before publishing',
    });
  }
}

export const productBodySchema = productFieldsSchema.superRefine((data, ctx) => {
  if (data.status === 'published' && (!data.images || data.images.length === 0)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['images'],
      message: 'Add at least one image before publishing',
    });
  }
});

export const productUpdateSchema = productFieldsSchema.partial().superRefine(requireImagesWhenPublishing);

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
