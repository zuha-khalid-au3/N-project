import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard.jsx';
import Seo from '../components/Seo.jsx';
import StatusMessage from '../components/StatusMessage.jsx';
import { useBusiness } from '../context/BusinessContext.jsx';
import { fetchFeaturedProducts } from '../services/productService.js';
import { buildWhatsAppUrl, generalQuoteMessage } from '../utils/whatsapp.js';

export default function Home() {
  const business = useBusiness();
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFeaturedProducts()
      .then((response) => setFeatured(response.data.items || []))
      .catch(() => setError('Unable to load featured products right now.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Seo
        title="Crafted Brilliance for Every Creation"
        description={business.tagline}
        path="/"
      />

      <section className="hero">
        <div className="hero__glow hero__glow--one" aria-hidden="true" />
        <div className="hero__glow hero__glow--two" aria-hidden="true" />
        <div className="hero__overlay" />
        <div className="hero__content">
          <p className="hero__brand">{business.name}</p>
          <h1>Crafted Brilliance for Every Creation</h1>
          <p className="hero__support">
            Browse ready catalogue pieces and request a quote in one step — colour, cut, size, and
            wholesale quantities for jewellery makers and buyers.
          </p>
          <div className="hero__actions">
            <Link className="btn btn--gold" to="/products">
              Explore Products
            </Link>
            <a
              className="btn btn--ghost-light"
              href={buildWhatsAppUrl(business.whatsapp, generalQuoteMessage())}
              target="_blank"
              rel="noreferrer"
            >
              Request a Quote
            </a>
          </div>
        </div>
      </section>

      <section className="buy-strip" aria-label="How to order">
        <div className="buy-strip__inner">
          <div>
            <strong>01</strong>
            <p>Browse the catalogue</p>
          </div>
          <div>
            <strong>02</strong>
            <p>Pick colour, shape, size</p>
          </div>
          <div>
            <strong>03</strong>
            <p>Ask on WhatsApp for quotation</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section__header section__header--split">
          <div>
            <h2>Shop by Collection</h2>
            <p>Open a collection and enquire on the pieces you need.</p>
          </div>
          <Link className="text-link" to="/products">
            View Collection
          </Link>
        </div>
        <div className="category-grid">
          {business.categories.map((category, index) => (
            <Link
              key={category}
              className={`category-link category-link--tone-${(index % 4) + 1}`}
              to={`/products?category=${encodeURIComponent(category)}`}
            >
              <span>{category}</span>
              <em>View Collection</em>
            </Link>
          ))}
        </div>
      </section>

      <section className="section section--muted">
        <div className="section__header section__header--split">
          <div>
            <h2>Ready to Enquire</h2>
            <p>Featured pieces with direct WhatsApp quotation actions.</p>
          </div>
          <Link className="btn btn--gold" to="/products">
            Explore Products
          </Link>
        </div>
        {loading ? <StatusMessage>Loading featured products…</StatusMessage> : null}
        {error ? <StatusMessage tone="error">{error}</StatusMessage> : null}
        {!loading && !error && featured.length === 0 ? (
          <StatusMessage>No featured products published yet.</StatusMessage>
        ) : null}
        <div className="product-grid">
          {featured.map((product) => (
            <ProductCard key={product._id || product.slug} product={product} />
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section__header">
          <h2>Manufacturing & Quality</h2>
          <p>Built for wholesale and custom gem requirements.</p>
        </div>
        <ul className="claim-list claim-list--tiles">
          {business.manufacturingClaims.map((claim) => (
            <li key={claim}>{claim}</li>
          ))}
        </ul>
      </section>

      <section className="enquiry-band">
        <div>
          <h2>Looking for a specific colour, shape, or size?</h2>
          <p>Share your requirements and get availability plus quotation details quickly.</p>
        </div>
        <div className="hero__actions">
          <a
            className="btn btn--gold"
            href={buildWhatsAppUrl(business.whatsapp, generalQuoteMessage())}
            target="_blank"
            rel="noreferrer"
          >
            Chat on WhatsApp
          </a>
          <Link className="btn btn--ghost-light" to="/contact">
            Request a Quote
          </Link>
        </div>
      </section>
    </>
  );
}
