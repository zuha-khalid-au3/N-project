import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Seo from '../../components/Seo.jsx';
import StatusMessage from '../../components/StatusMessage.jsx';
import {
  deleteProduct,
  fetchAdminDashboard,
  publishProduct,
  unpublishProduct,
} from '../../services/productService.js';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ total: 0, published: 0, draft: 0, hidden: 0 });
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  async function load() {
    setLoading(true);
    setError('');
    try {
      const response = await fetchAdminDashboard();
      setStats(response.data.stats);
      setRecent(response.data.recent || []);
    } catch {
      setError('Unable to load dashboard.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handlePublish(id) {
    await publishProduct(id);
    setMessage('Product published successfully.');
    await load();
  }

  async function handleUnpublish(id) {
    await unpublishProduct(id);
    setMessage('Product unpublished successfully.');
    await load();
  }

  async function handleDelete(id, name) {
    if (!window.confirm(`Delete "${name}" permanently?`)) return;
    await deleteProduct(id);
    setMessage('Product deleted successfully.');
    await load();
  }

  return (
    <div className="admin-page">
      <Seo title="Admin Dashboard" path="/admin" />
      <div className="admin-page__header">
        <div>
          <h1>Dashboard</h1>
          <p>Manage catalogue products and publishing status.</p>
        </div>
        <Link className="btn btn--gold" to="/admin/products/new">
          Add Product
        </Link>
      </div>

      {loading ? <StatusMessage>Loading dashboard…</StatusMessage> : null}
      {error ? <StatusMessage tone="error">{error}</StatusMessage> : null}
      {message ? <StatusMessage tone="success">{message}</StatusMessage> : null}

      <div className="stat-grid">
        <div className="stat-card">
          <span>Total</span>
          <strong>{stats.total}</strong>
        </div>
        <div className="stat-card">
          <span>Published</span>
          <strong>{stats.published}</strong>
        </div>
        <div className="stat-card">
          <span>Draft</span>
          <strong>{stats.draft}</strong>
        </div>
        <div className="stat-card">
          <span>Hidden</span>
          <strong>{stats.hidden}</strong>
        </div>
      </div>

      <section>
        <h2>Recent products</h2>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((product) => (
                <tr key={product._id}>
                  <td>{product.name}</td>
                  <td>{product.category}</td>
                  <td>{product.status}</td>
                  <td className="admin-actions">
                    <Link to={`/admin/products/${product._id}/edit`}>Edit</Link>
                    {product.status !== 'published' ? (
                      <button type="button" onClick={() => handlePublish(product._id)}>
                        Publish Product
                      </button>
                    ) : (
                      <button type="button" onClick={() => handleUnpublish(product._id)}>
                        Unpublish
                      </button>
                    )}
                    <button type="button" onClick={() => handleDelete(product._id, product.name)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
