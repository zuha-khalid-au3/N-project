import { useState } from 'react';
import Seo from '../components/Seo.jsx';
import StatusMessage from '../components/StatusMessage.jsx';
import { useBusiness } from '../context/BusinessContext.jsx';
import { submitInquiry } from '../services/productService.js';
import { buildWhatsAppUrl, generalQuoteMessage } from '../utils/whatsapp.js';

const initial = {
  name: '',
  email: '',
  phone: '',
  company: '',
  message: '',
};

export default function Contact() {
  const business = useBusiness();
  const [form, setForm] = useState(initial);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setSuccess('');
    setError('');
    try {
      await submitInquiry(form);
      setSuccess('Enquiry submitted successfully. We will respond shortly.');
      setForm(initial);
    } catch (err) {
      setError(err.message || 'Unable to submit enquiry.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page">
      <Seo
        title="Contact"
        description={`Contact ${business.name} for wholesale enquiries and custom gem requirements.`}
        path="/contact"
      />
      <div className="contact-layout">
        <div>
          <h1>Contact</h1>
          <p className="lead">Request a quote or discuss colour, shape, and size requirements.</p>
          <ul className="contact-list">
            <li>
              <strong>Phone</strong>
              <span>{business.phone}</span>
            </li>
            <li>
              <strong>WhatsApp</strong>
              <a href={buildWhatsAppUrl(business.whatsapp, generalQuoteMessage())} target="_blank" rel="noreferrer">
                Chat on WhatsApp
              </a>
            </li>
            <li>
              <strong>Email</strong>
              <a href={`mailto:${business.email}`}>{business.email}</a>
            </li>
            <li>
              <strong>Address</strong>
              <span>{business.address}</span>
            </li>
            <li>
              <strong>Hours</strong>
              <span>{business.hours}</span>
            </li>
          </ul>
          {business.mapUrl ? (
            <a className="btn btn--secondary" href={business.mapUrl} target="_blank" rel="noreferrer">
              Open in Google Maps
            </a>
          ) : null}
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
          <h2>Request a Quote</h2>
          {success ? <StatusMessage tone="success">{success}</StatusMessage> : null}
          {error ? <StatusMessage tone="error">{error}</StatusMessage> : null}
          <label>
            Name
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </label>
          <label>
            Email
            <input
              required
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </label>
          <label>
            Phone
            <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </label>
          <label>
            Company
            <input
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
            />
          </label>
          <label>
            Message
            <textarea
              required
              rows={5}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
            />
          </label>
          <button className="btn btn--gold" type="submit" disabled={submitting}>
            {submitting ? 'Sending…' : 'Request a Quote'}
          </button>
        </form>
      </div>
    </div>
  );
}
