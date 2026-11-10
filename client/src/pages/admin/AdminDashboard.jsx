import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Seo from '../../components/Seo.jsx';
import StatusMessage from '../../components/StatusMessage.jsx';
import {
  deleteProduct,
  fetchAdminDashboard,
  hideProduct,
  publishProduct,
  unpublishProduct,
} from '../../services/productService.js';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ total: 0, published: 0, draft: 0, hidden: 0 });
  const [inquiries, setInquiries] = useState({ new: 0, contacted: 0, closed: 0, total: 0 });
  const [recent, setRecent] = useState([]);
  const [recentInquiries, setRecentInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  async function load() {
    setLoading(true);
    setError('');
    try {
      const response = await fetchAdminDashboard();
      setStats(response.data.stats);
      setInquiries(response.data.inquiries || { new: 0, contacted: 0, closed: 0, total: 0 });
      setRecent(response.data.recent || []);
      setRecentInquiries(response.data.recentInquiries || []);
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

  async function handleHide(id) {
    await hideProduct(id);
    setMessage('Product hidden successfully.');
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
          <p>Catalogue health, publishing shortcuts, and latest enquiries.</p>
        </div>
        <div className="admin-page__actions">
          <Link className="btn btn--secondary" to="/admin/products">
            Manage Products
          </Link>
          <Link className="btn btn--gold" to="/admin/products/new">
            Add Product
          </Link>
        </div>
      </div>

      {loading ? <StatusMessage>Loading dashboard…</StatusMessage> : null}
      {error ? <StatusMessage tone="error">{error}</StatusMessage> : null}
      {message ? <StatusMessage tone="success">{message}</StatusMessage> : null}

      <div className="stat-grid">
        <div className="stat-card">
          <span>Total products</span>
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
        <div className="stat-card">
          <span>New enquiries</span>
          <strong>{inquiries.new}</strong>
        </div>
        <div className="stat-card">
          <span>Total enquiries</span>
          <strong>{inquiries.total}</strong>
        </div>
      </div>

      <div className="admin-quick-links">
        <Link to="/admin/products?status=draft">Review drafts</Link>
        <Link to="/admin/inquiries">Open enquiries ({inquiries.new})</Link>
        <a href="/" target="_blank" rel="noreferrer">
          Preview website
        </a>
      </div>

      <section className="admin-split">
        <div>
          <div className="section__header section__header--split">
            <h2>Recent products</h2>
            <Link className="text-link" to="/admin/products">
              View all
            </Link>
          </div>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((product) => (
                  <tr key={product._id}>
                    <td data-label="Name">{product.name}</td>
                    <td data-label="Status">
                      <span className={`status-badge status-badge--${product.status}`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="admin-actions" data-label="Actions">
                      <Link to={`/admin/products/${product._id}/edit`}>Edit</Link>
                      {product.status !== 'published' ? (
                        <button type="button" onClick={() => handlePublish(product._id)}>
                          Publish
                        </button>
                      ) : (
                        <button type="button" onClick={() => handleUnpublish(product._id)}>
                          Unpublish
                        </button>
                      )}
                      {product.status !== 'hidden' ? (
                        <button type="button" onClick={() => handleHide(product._id)}>
                          Hide
                        </button>
                      ) : null}
                      <button type="button" onClick={() => handleDelete(product._id, product.name)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <div className="section__header section__header--split">
            <h2>Latest enquiries</h2>
            <Link className="text-link" to="/admin/inquiries">
              View all
            </Link>
          </div>
          {recentInquiries.length === 0 ? (
            <StatusMessage>No enquiries yet.</StatusMessage>
          ) : (
            <div className="inquiry-list inquiry-list--compact">
              {recentInquiries.map((inquiry) => (
                <article key={inquiry._id} className="inquiry-card">
                  <div className="inquiry-card__top">
                    <strong>{inquiry.name}</strong>
                    <span className={`status-badge status-badge--${inquiry.status}`}>
                      {inquiry.status}
                    </span>
                  </div>
                  <p>{inquiry.message}</p>
                  <small>{inquiry.email}</small>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
