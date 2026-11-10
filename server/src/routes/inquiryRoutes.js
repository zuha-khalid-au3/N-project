import { Router } from 'express';
import { createInquiry, listInquiries, updateInquiry } from '../controllers/inquiryController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/adminMiddleware.js';
import { inquiryRateLimiter } from '../middleware/rateLimitMiddleware.js';
import { validate } from '../middleware/validationMiddleware.js';
import { inquirySchema, inquiryStatusSchema } from '../validators/inquiryValidators.js';

const router = Router();

router.post('/inquiries', inquiryRateLimiter, validate(inquirySchema), createInquiry);
router.get('/admin/inquiries', requireAuth, requireAdmin, listInquiries);
router.patch(
  '/admin/inquiries/:id',
  requireAuth,
  requireAdmin,
  validate(inquiryStatusSchema),
  updateInquiry
);

export default router;
