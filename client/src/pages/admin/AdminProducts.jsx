import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Seo from '../../components/Seo.jsx';
import StatusMessage from '../../components/StatusMessage.jsx';
import {
  deleteProduct,
  fetchAdminProducts,
  hideProduct,
  publishProduct,
  toggleFeaturedProduct,
  unpublishProduct,
} from '../../services/productService.js';
import { formatStockStatus, resolveImageUrl } from '../../utils/format.js';

export default function AdminProducts() {
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  async function load(nextPage = page, nextQ = q, nextStatus = status) {
    setLoading(true);
    setError('');
    try {
      const response = await fetchAdminProducts({
        page: nextPage,
        limit: 20,
        q: nextQ,
        status: nextStatus,
      });
      setItems(response.data.items || []);
      setPagination(response.data.pagination || { page: 1, pages: 1, total: 0 });
    } catch {
      setError('Unable to load products.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load(1, q, status);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function runAction(action, successMessage) {
    try {
      await action();
      setMessage(successMessage);
      await load(page, q, status);
    } catch (err) {
      setError(err.message || 'Action failed.');
    }
  }

  return (
    <div className="admin-page">
      <Seo title="Manage Products" path="/admin/products" />
      <div className="admin-page__header">
        <div>
          <h1>Products</h1>
          <p>Search, publish, hide, feature, and delete catalogue items.</p>
        </div>
        <Link className="btn btn--gold" to="/admin/products/new">
          Add Product
        </Link>
      </div>

      <form
        className="admin-toolbar"
        onSubmit={(event) => {
          event.preventDefault();
          setPage(1);
          load(1, q, status);
        }}
      >
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search name, SKU, category"
          aria-label="Search products"
        />
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
            load(1, q, e.target.value);
          }}
          aria-label="Filter by status"
        >
          <option value="">All statuses</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="hidden">Hidden</option>
        </select>
        <button className="btn btn--secondary" type="submit">
          Search
        </button>
      </form>

      {loading ? <StatusMessage>Loading products…</StatusMessage> : null}
      {error ? <StatusMessage tone="error">{error}</StatusMessage> : null}
      {message ? <StatusMessage tone="success">{message}</StatusMessage> : null}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Featured</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((product) => {
              const image = product.images?.[0];
              return (
                <tr key={product._id}>
                  <td>
                    <div className="admin-product-cell">
                      {image ? (
                        <img src={resolveImageUrl(image.url)} alt="" />
                      ) : (
                        <span className="admin-product-cell__ph" />
                      )}
                      <div>
                        <strong>{product.name}</strong>
                        <small>{product.sku || product.slug}</small>
                      </div>
                    </div>
                  </td>
                  <td>{product.category}</td>
                  <td>{formatStockStatus(product.stockStatus)}</td>
                  <td>
                    <span className={`status-badge status-badge--${product.status}`}>
                      {product.status}
                    </span>
                  </td>
                  <td>{product.featured ? 'Yes' : 'No'}</td>
                  <td className="admin-actions">
                    <Link to={`/admin/products/${product._id}/edit`}>Edit</Link>
                    {product.status !== 'published' ? (
                      <button
                        type="button"
                        onClick={() =>
                          runAction(() => publishProduct(product._id), 'Product published.')
                        }
                      >
                        Publish
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() =>
                          runAction(() => unpublishProduct(product._id), 'Product unpublished.')
                        }
                      >
                        Unpublish
                      </button>
                    )}
                    {product.status !== 'hidden' ? (
                      <button
                        type="button"
                        onClick={() => runAction(() => hideProduct(product._id), 'Product hidden.')}
                      >
                        Hide
                      </button>
                    ) : null}
                    <button
                      type="button"
                      onClick={() =>
                        runAction(
                          () => toggleFeaturedProduct(product._id, !product.featured),
                          product.featured ? 'Removed from featured.' : 'Marked as featured.'
                        )
                      }
                    >
                      {product.featured ? 'Unfeature' : 'Feature'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (!window.confirm(`Delete "${product.name}" permanently?`)) return;
                        runAction(() => deleteProduct(product._id), 'Product deleted.');
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {pagination.pages > 1 ? (
        <div className="pagination">
          <button
            type="button"
            className="btn btn--secondary"
            disabled={page <= 1}
            onClick={() => {
              const next = page - 1;
              setPage(next);
              load(next, q, status);
            }}
          >
            Previous
          </button>
          <span>
            Page {pagination.page} of {pagination.pages} · {pagination.total} products
          </span>
          <button
            type="button"
            className="btn btn--secondary"
            disabled={page >= pagination.pages}
            onClick={() => {
              const next = page + 1;
              setPage(next);
              load(next, q, status);
            }}
          >
            Next
          </button>
        </div>
      ) : null}
    </div>
  );
}
