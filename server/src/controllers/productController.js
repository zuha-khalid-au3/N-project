import { businessConfig } from '../config/business.js';
import {
  createProduct,
  deleteProduct,
  getAdminProductById,
  getAdminStats,
  getFilterOptions,
  getPublicProductBySlug,
  getRelatedProducts,
  listAdminProducts,
  listFeaturedProducts,
  listPublicProducts,
  setProductStatus,
  updateProduct,
} from '../services/productService.js';
import { failure, success } from '../utils/response.js';

export async function getHealth(req, res) {
  return res.json({ ok: true });
}

export async function getBusinessConfig(req, res) {
  return success(res, { business: businessConfig });
}

export async function getPublicProducts(req, res, next) {
  try {
    const data = await listPublicProducts(req.validatedQuery || req.query);
    return success(res, data);
  } catch (error) {
    return next(error);
  }
}

export async function getFeaturedProducts(req, res, next) {
  try {
    const items = await listFeaturedProducts();
    return success(res, { items });
  } catch (error) {
    return next(error);
  }
}

export async function getPublicProduct(req, res, next) {
  try {
    const product = await getPublicProductBySlug(req.params.slug);
    if (!product) {
      return failure(res, 'NOT_FOUND', 'Product not found', 404);
    }
    const related = await getRelatedProducts(product);
    return success(res, { product, related });
  } catch (error) {
    return next(error);
  }
}

export async function getCategories(req, res, next) {
  try {
    const filters = await getFilterOptions();
    const categories = filters.categories.length
      ? filters.categories
      : businessConfig.categories;
    return success(res, { categories });
  } catch (error) {
    return next(error);
  }
}

export async function getFilters(req, res, next) {
  try {
    const filters = await getFilterOptions();
    return success(res, { filters });
  } catch (error) {
    return next(error);
  }
}

export async function adminListProducts(req, res, next) {
  try {
    const data = await listAdminProducts(req.validatedQuery || req.query);
    return success(res, data);
  } catch (error) {
    return next(error);
  }
}

export async function adminDashboard(req, res, next) {
  try {
    const stats = await getAdminStats();
    const recent = await listAdminProducts({ page: 1, limit: 8, q: '', status: '' });
    return success(res, { stats, recent: recent.items });
  } catch (error) {
    return next(error);
  }
}

export async function adminGetProduct(req, res, next) {
  try {
    const product = await getAdminProductById(req.params.id);
    if (!product) {
      return failure(res, 'NOT_FOUND', 'Product not found', 404);
    }
    return success(res, { product });
  } catch (error) {
    return next(error);
  }
}

export async function adminCreateProduct(req, res, next) {
  try {
    const product = await createProduct(req.body);
    return success(res, { product }, 'Product created successfully', 201);
  } catch (error) {
    return next(error);
  }
}

export async function adminUpdateProduct(req, res, next) {
  try {
    const product = await updateProduct(req.params.id, req.body);
    if (!product) {
      return failure(res, 'NOT_FOUND', 'Product not found', 404);
    }
    return success(res, { product }, 'Product updated successfully');
  } catch (error) {
    return next(error);
  }
}

export async function adminDeleteProduct(req, res, next) {
  try {
    const deleted = await deleteProduct(req.params.id);
    if (!deleted) {
      return failure(res, 'NOT_FOUND', 'Product not found', 404);
    }
    return success(res, {}, 'Product deleted successfully');
  } catch (error) {
    return next(error);
  }
}

export async function adminPublishProduct(req, res, next) {
  try {
    const product = await setProductStatus(req.params.id, 'published');
    if (!product) {
      return failure(res, 'NOT_FOUND', 'Product not found', 404);
    }
    return success(res, { product }, 'Product published successfully');
  } catch (error) {
    return next(error);
  }
}

export async function adminUnpublishProduct(req, res, next) {
  try {
    const product = await setProductStatus(req.params.id, 'draft');
    if (!product) {
      return failure(res, 'NOT_FOUND', 'Product not found', 404);
    }
    return success(res, { product }, 'Product unpublished successfully');
  } catch (error) {
    return next(error);
  }
}
