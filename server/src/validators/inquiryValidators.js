import { z } from 'zod';

export const inquirySchema = z.object({
  productId: z.string().optional().nullable(),
  name: z.string().min(2).max(120),
  email: z.string().email().transform((v) => v.toLowerCase()),
  phone: z.string().max(40).optional().default(''),
  company: z.string().max(120).optional().default(''),
  message: z.string().min(10).max(2000),
});

export const inquiryStatusSchema = z.object({
  status: z.enum(['new', 'contacted', 'closed']),
});
