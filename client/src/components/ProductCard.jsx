import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useBusiness } from '../context/BusinessContext.jsx';
import { formatStockStatus, resolveImageUrl } from '../utils/format.js';
import { buildWhatsAppUrl, productEnquiryMessage } from '../utils/whatsapp.js';

const toneMap = {
  ruby: '#7a1f2b',
  emerald: '#1f5c45',
  sapphire: '#1f3d79',
  gold: '#8a6a2f',
  crystal: '#4a5568',
};

function placeholderTone(product) {
  const key = `${product.color || ''} ${product.name || ''}`.toLowerCase();
  if (key.includes('ruby')) return toneMap.ruby;
  if (key.includes('emerald')) return toneMap.emerald;
  if (key.includes('sapphire')) return toneMap.sapphire;
  if (key.includes('gold') || key.includes('amber')) return toneMap.gold;
  return toneMap.crystal;
}

export default function ProductCard({ product, featured = false }) {
  const business = useBusiness();
  const image = product.images?.[0];
  const tone = placeholderTone(product);
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = Boolean(image) && !imageFailed;

  return (
    <article className={`product-card ${featured ? 'product-card--featured' : ''}`}>
      <Link to={`/products/${product.slug}`} className="product-card__media">
        {showImage ? (
          <img
            src={resolveImageUrl(image.url)}
            alt={image.altText || product.name}
            loading={featured ? 'eager' : 'lazy'}
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div
            className="product-card__placeholder product-card__placeholder--gem"
            style={{ '--gem-tone': tone }}
            aria-hidden="true"
          >
            <span className="gem-facet" />
            <strong>{product.color || product.category}</strong>
          </div>
        )}
        <span className={`stock-pill stock-pill--${product.stockStatus}`}>
          {formatStockStatus(product.stockStatus)}
        </span>
      </Link>
      <div className="product-card__body">
        <p className="product-card__meta">{product.category}</p>
        <h3>
          <Link to={`/products/${product.slug}`}>{product.name}</Link>
        </h3>
        <ul className="spec-list">
          {product.color ? <li>{product.color}</li> : null}
          {product.shape ? <li>{product.shape}</li> : null}
          {product.size ? <li>{product.size}</li> : null}
        </ul>
        <p className="product-card__price">{product.priceLabel || 'Contact for quotation'}</p>
        <div className="product-card__actions">
          <a
            className="btn btn--gold btn--compact"
            href={buildWhatsAppUrl(business.whatsapp, productEnquiryMessage(product.name))}
            target="_blank"
            rel="noreferrer"
          >
            Ask on WhatsApp
          </a>
          <Link className="btn btn--secondary btn--compact" to={`/products/${product.slug}`}>
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
}
