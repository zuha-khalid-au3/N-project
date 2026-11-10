import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard.jsx';
import Seo from '../components/Seo.jsx';
import StatusMessage from '../components/StatusMessage.jsx';
import { fetchFilters, fetchProducts } from '../services/productService.js';

const emptyFilters = {
  categories: [],
  colors: [],
  shapes: [],
  materials: [],
  stockStatuses: [],
};

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [filters, setFilters] = useState(emptyFilters);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const query = useMemo(
    () => ({
      q: searchParams.get('q') || '',
      category: searchParams.get('category') || '',
      color: searchParams.get('color') || '',
      shape: searchParams.get('shape') || '',
      material: searchParams.get('material') || '',
      stockStatus: searchParams.get('stockStatus') || '',
      featured: searchParams.get('featured') || '',
      sort: searchParams.get('sort') || 'newest',
      page: searchParams.get('page') || '1',
    }),
    [searchParams]
  );

  useEffect(() => {
    fetchFilters()
      .then((response) => setFilters(response.data.filters || emptyFilters))
      .catch(() => setFilters(emptyFilters));
  }, []);

  useEffect(() => {
    setLoading(true);
    setError('');
    fetchProducts(query)
      .then((response) => {
        setProducts(response.data.items || []);
        setPagination(response.data.pagination || { page: 1, pages: 1, total: 0 });
      })
      .catch(() => setError('Unable to load products.'))
      .finally(() => setLoading(false));
  }, [query]);

  function updateParam(key, value) {
    const next = new URLSearchParams(searchParams);
    if (!value) next.delete(key);
    else next.set(key, value);
    if (key !== 'page') next.delete('page');
    setSearchParams(next);
  }

  return (
    <div className="page">
      <Seo
        title="Products"
        description="Browse artificial gems, decorative stones, beads, and custom designs."
        path="/products"
      />
      <div className="page__header">
        <h1>Products</h1>
        <p>Search and filter the published catalogue.</p>
      </div>

      <form
        className="filter-bar"
        onSubmit={(event) => {
          event.preventDefault();
          updateParam('q', event.currentTarget.elements.q.value.trim());
        }}
      >
        <input name="q" defaultValue={query.q} placeholder="Search products" aria-label="Search products" />
        <select
          aria-label="Category"
          value={query.category}
          onChange={(e) => updateParam('category', e.target.value)}
        >
          <option value="">All categories</option>
          {filters.categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <select aria-label="Colour" value={query.color} onChange={(e) => updateParam('color', e.target.value)}>
          <option value="">All colours</option>
          {filters.colors.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <select aria-label="Shape" value={query.shape} onChange={(e) => updateParam('shape', e.target.value)}>
          <option value="">All shapes</option>
          {filters.shapes.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <select
          aria-label="Material"
          value={query.material}
          onChange={(e) => updateParam('material', e.target.value)}
        >
          <option value="">All materials</option>
          {filters.materials.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <select
          aria-label="Stock status"
          value={query.stockStatus}
          onChange={(e) => updateParam('stockStatus', e.target.value)}
        >
          <option value="">All stock statuses</option>
          {filters.stockStatuses.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <select aria-label="Sort" value={query.sort} onChange={(e) => updateParam('sort', e.target.value)}>
          <option value="newest">Newest</option>
          <option value="name">Name</option>
          <option value="featured">Featured</option>
        </select>
        <button className="btn btn--secondary" type="submit">
          Search
        </button>
      </form>

      {loading ? <StatusMessage>Loading products…</StatusMessage> : null}
      {error ? <StatusMessage tone="error">{error}</StatusMessage> : null}
      {!loading && !error && products.length === 0 ? (
        <StatusMessage>No products match your filters.</StatusMessage>
      ) : null}

      <div className="product-grid">
        {products.map((product) => (
          <ProductCard key={product._id || product.slug} product={product} />
        ))}
      </div>

      {pagination.pages > 1 ? (
        <div className="pagination">
          <button
            type="button"
            className="btn btn--secondary"
            disabled={pagination.page <= 1}
            onClick={() => updateParam('page', String(pagination.page - 1))}
          >
            Previous
          </button>
          <span>
            Page {pagination.page} of {pagination.pages}
          </span>
          <button
            type="button"
            className="btn btn--secondary"
            disabled={pagination.page >= pagination.pages}
            onClick={() => updateParam('page', String(pagination.page + 1))}
          >
            Next
          </button>
        </div>
      ) : null}
    </div>
  );
}
