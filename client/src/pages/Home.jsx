import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard.jsx';
import Seo from '../components/Seo.jsx';
import StatusMessage from '../components/StatusMessage.jsx';
import { useBusiness } from '../context/BusinessContext.jsx';
import { fetchFeaturedProducts, fetchProducts } from '../services/productService.js';
import { withRetry } from '../utils/retry.js';
import { buildWhatsAppUrl, generalQuoteMessage } from '../utils/whatsapp.js';

function mergeProducts(featured = [], latest = []) {
  const seen = new Set();
  const merged = [];
  for (const product of [...featured, ...latest]) {
    const key = product._id || product.slug;
    if (!key || seen.has(key)) continue;
    seen.add(key);
    merged.push(product);
  }
  return merged;
}

function ProductSkeleton() {
  return (
    <div className="product-skeleton" aria-hidden="true">
      <div className="product-skeleton__media" />
      <div className="product-skeleton__line" />
      <div className="product-skeleton__line product-skeleton__line--short" />
      <div className="product-skeleton__line product-skeleton__line--price" />
    </div>
  );
}

export default function Home() {
  const business = useBusiness();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [featuredResponse, productsResponse] = await withRetry(
        () =>
          Promise.all([
            fetchFeaturedProducts().catch(() => ({ data: { items: [] } })),
            fetchProducts({ limit: 16, sort: 'newest' }),
          ]),
        { retries: 4, delayMs: 2000 }
      );
      setProducts(
        mergeProducts(featuredResponse.data.items || [], productsResponse.data.items || [])
      );
    } catch {
      setError(
        'Unable to load products right now. The server may be waking up — please retry in a few seconds.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  return (
    <>
      <Seo
        title="Shop Artificial Gems & Stones"
        description={business.tagline}
        path="/"
      />

      <section className="store-banner">
        <div className="store-banner__inner">
          <div>
            <p className="store-banner__brand">{business.name}</p>
            <h1>Shop gems & stones online</h1>
            <p>Pick a product below and request a quote instantly on WhatsApp.</p>
          </div>
          <div className="store-banner__actions">
            <a className="btn btn--gold" href="#shop">
              Shop now
            </a>
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

      <section id="shop" className="section section--shop-first">
        <div className="shop-toolbar">
          <div>
            <h2>All products</h2>
            <p>{loading ? 'Loading catalogue…' : `${products.length} pieces ready to enquire`}</p>
          </div>
          <div className="category-chips" aria-label="Quick collections">
            {business.categories.map((category) => (
              <Link
                key={category}
                className="category-chip"
                to={`/products?category=${encodeURIComponent(category)}`}
              >
                {category}
              </Link>
            ))}
          </div>
        </div>

        {error ? (
          <div>
            <StatusMessage tone="error">{error}</StatusMessage>
            <button type="button" className="btn btn--gold" onClick={loadProducts}>
              Retry loading products
            </button>
          </div>
        ) : null}

        {loading ? (
          <div className="product-grid product-grid--shop">
            {Array.from({ length: 8 }).map((_, index) => (
              <ProductSkeleton key={index} />
            ))}
          </div>
        ) : null}

        {!loading && !error && products.length === 0 ? (
          <StatusMessage>No published products yet. Check back soon.</StatusMessage>
        ) : null}

        {!loading && products.length > 0 ? (
          <div className="product-grid product-grid--shop">
            {products.map((product, index) => (
              <ProductCard
                key={product._id || product.slug}
                product={product}
                featured={index === 0}
              />
            ))}
          </div>
        ) : null}

        {!loading && products.length > 0 ? (
          <div className="shop-footer-cta">
            <Link className="btn btn--gold" to="/products">
              View full catalogue
            </Link>
          </div>
        ) : null}
      </section>

      <section className="section section--muted">
        <div className="section__header">
          <h2>Why buyers choose us</h2>
          <p>Clear catalogue, fast WhatsApp quotes, and wholesale-friendly ordering.</p>
        </div>
        <ul className="claim-list claim-list--tiles">
          {business.manufacturingClaims.map((claim) => (
            <li key={claim}>{claim}</li>
          ))}
        </ul>
      </section>

      <section className="enquiry-band">
        <div>
          <h2>Need a custom colour, shape, or size?</h2>
          <p>Tell us what you need and get a quotation quickly.</p>
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
