import { Router } from 'express';
import multer from 'multer';
import { deleteUpload, signUpload, uploadFile } from '../controllers/uploadController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/adminMiddleware.js';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
});

const router = Router();

router.post('/admin/uploads/sign', requireAuth, requireAdmin, signUpload);
router.post('/admin/uploads', requireAuth, requireAdmin, upload.single('file'), uploadFile);
router.delete('/admin/uploads', requireAuth, requireAdmin, deleteUpload);

export default router;
