import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Enter a valid email address').transform((v) => v.toLowerCase()),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});
