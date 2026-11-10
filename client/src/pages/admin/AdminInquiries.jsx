import { useEffect, useState } from 'react';
import Seo from '../../components/Seo.jsx';
import StatusMessage from '../../components/StatusMessage.jsx';
import { fetchInquiries, updateInquiryStatus } from '../../services/productService.js';

export default function AdminInquiries() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  async function load() {
    setLoading(true);
    setError('');
    try {
      const response = await fetchInquiries();
      setItems(response.data.items || []);
    } catch {
      setError('Unable to load enquiries.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function changeStatus(id, status) {
    try {
      await updateInquiryStatus(id, status);
      setMessage(`Enquiry marked as ${status}.`);
      await load();
    } catch (err) {
      setError(err.message || 'Unable to update enquiry.');
    }
  }

  return (
    <div className="admin-page">
      <Seo title="Enquiries" path="/admin/inquiries" />
      <div className="admin-page__header">
        <div>
          <h1>Enquiries</h1>
          <p>Track quote requests from the contact form.</p>
        </div>
      </div>

      {loading ? <StatusMessage>Loading enquiries…</StatusMessage> : null}
      {error ? <StatusMessage tone="error">{error}</StatusMessage> : null}
      {message ? <StatusMessage tone="success">{message}</StatusMessage> : null}
      {!loading && items.length === 0 ? (
        <StatusMessage>No enquiries yet.</StatusMessage>
      ) : null}

      <div className="inquiry-list">
        {items.map((inquiry) => (
          <article key={inquiry._id} className="inquiry-card">
            <div className="inquiry-card__top">
              <div>
                <h2>{inquiry.name}</h2>
                <p>
                  <a href={`mailto:${inquiry.email}`}>{inquiry.email}</a>
                  {inquiry.phone ? ` · ${inquiry.phone}` : ''}
                  {inquiry.company ? ` · ${inquiry.company}` : ''}
                </p>
              </div>
              <span className={`status-badge status-badge--${inquiry.status}`}>{inquiry.status}</span>
            </div>
            <p className="inquiry-card__message">{inquiry.message}</p>
            <div className="admin-actions">
              {inquiry.status !== 'contacted' ? (
                <button type="button" onClick={() => changeStatus(inquiry._id, 'contacted')}>
                  Mark contacted
                </button>
              ) : null}
              {inquiry.status !== 'closed' ? (
                <button type="button" onClick={() => changeStatus(inquiry._id, 'closed')}>
                  Close
                </button>
              ) : null}
              {inquiry.status !== 'new' ? (
                <button type="button" onClick={() => changeStatus(inquiry._id, 'new')}>
                  Reopen
                </button>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
