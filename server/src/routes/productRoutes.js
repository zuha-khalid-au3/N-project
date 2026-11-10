import { Router } from 'express';
import {
  adminCreateProduct,
  adminDashboard,
  adminDeleteProduct,
  adminGetProduct,
  adminListProducts,
  adminPublishProduct,
  adminUnpublishProduct,
  adminUpdateProduct,
  getCategories,
  getFeaturedProducts,
  getFilters,
  getPublicProduct,
  getPublicProducts,
} from '../controllers/productController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/adminMiddleware.js';
import { validate } from '../middleware/validationMiddleware.js';
import {
  adminProductQuerySchema,
  productBodySchema,
  productUpdateSchema,
  publicProductQuerySchema,
} from '../validators/productValidators.js';

const router = Router();

router.get('/products', validate(publicProductQuerySchema, 'query'), getPublicProducts);
router.get('/products/featured', getFeaturedProducts);
router.get('/products/:slug', getPublicProduct);
router.get('/categories', getCategories);
router.get('/filters', getFilters);

router.get('/admin/dashboard', requireAuth, requireAdmin, adminDashboard);
router.get(
  '/admin/products',
  requireAuth,
  requireAdmin,
  validate(adminProductQuerySchema, 'query'),
  adminListProducts
);
router.post(
  '/admin/products',
  requireAuth,
  requireAdmin,
  validate(productBodySchema),
  adminCreateProduct
);
router.get('/admin/products/:id', requireAuth, requireAdmin, adminGetProduct);
router.patch(
  '/admin/products/:id',
  requireAuth,
  requireAdmin,
  validate(productUpdateSchema),
  adminUpdateProduct
);
router.delete('/admin/products/:id', requireAuth, requireAdmin, adminDeleteProduct);
router.post('/admin/products/:id/publish', requireAuth, requireAdmin, adminPublishProduct);
router.post('/admin/products/:id/unpublish', requireAuth, requireAdmin, adminUnpublishProduct);

export default router;
