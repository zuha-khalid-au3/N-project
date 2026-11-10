import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard.jsx';
import Seo from '../components/Seo.jsx';
import StatusMessage from '../components/StatusMessage.jsx';
import { useBusiness } from '../context/BusinessContext.jsx';
import { fetchProductBySlug } from '../services/productService.js';
import { formatStockStatus, resolveImageUrl } from '../utils/format.js';
import { buildWhatsAppUrl, productEnquiryMessage } from '../utils/whatsapp.js';

export default function ProductDetails() {
  const { slug } = useParams();
  const business = useBusiness();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    fetchProductBySlug(slug)
      .then((response) => {
        setProduct(response.data.product);
        setRelated(response.data.related || []);
        setActiveImage(0);
      })
      .catch(() => setError('Product not found or unavailable.'))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="page">
        <StatusMessage>Loading product…</StatusMessage>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="page">
        <StatusMessage tone="error">{error || 'Product not found.'}</StatusMessage>
        <Link className="btn btn--secondary" to="/products">
          Back to Products
        </Link>
      </div>
    );
  }

  const images = product.images || [];
  const current = images[activeImage];

  return (
    <div className="page">
      <Seo
        title={product.seo?.title || product.name}
        description={product.seo?.description || product.description}
        path={`/products/${product.slug}`}
        image={current ? resolveImageUrl(current.url) : undefined}
        type="product"
      />

      <Link className="back-link" to="/products">
        ← Back to catalogue
      </Link>

      <div className="product-detail">
        <div className="product-gallery">
          <div className="product-gallery__main">
            {current ? (
              <img src={resolveImageUrl(current.url)} alt={current.altText || product.name} />
            ) : (
              <div className="product-card__placeholder">No image available</div>
            )}
          </div>
          {images.length > 1 ? (
            <div className="product-gallery__thumbs">
              {images.map((image, index) => (
                <button
                  key={image.storageKey || index}
                  type="button"
                  className={index === activeImage ? 'is-active' : ''}
                  onClick={() => setActiveImage(index)}
                >
                  <img src={resolveImageUrl(image.url)} alt={image.altText || `${product.name} ${index + 1}`} />
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div className="product-detail__info">
          <p className="eyebrow">{product.category}</p>
          <h1>{product.name}</h1>
          <p className="lead">{product.description}</p>
          <dl className="spec-grid">
            {product.sku ? (
              <>
                <dt>SKU</dt>
                <dd>{product.sku}</dd>
              </>
            ) : null}
            {product.material ? (
              <>
                <dt>Material</dt>
                <dd>{product.material}</dd>
              </>
            ) : null}
            {product.color ? (
              <>
                <dt>Colour</dt>
                <dd>{product.color}</dd>
              </>
            ) : null}
            {product.shape ? (
              <>
                <dt>Shape</dt>
                <dd>{product.shape}</dd>
              </>
            ) : null}
            {product.size ? (
              <>
                <dt>Size</dt>
                <dd>{product.size}</dd>
              </>
            ) : null}
            {product.finish ? (
              <>
                <dt>Finish</dt>
                <dd>{product.finish}</dd>
              </>
            ) : null}
            {product.moq ? (
              <>
                <dt>MOQ</dt>
                <dd>{product.moq}</dd>
              </>
            ) : null}
            <dt>Stock</dt>
            <dd>{formatStockStatus(product.stockStatus)}</dd>
            <dt>Price</dt>
            <dd>{product.priceLabel || 'Contact for quotation'}</dd>
          </dl>
          <div className="buy-panel">
            <div>
              <p className="buy-panel__label">Ready to order</p>
              <p className="buy-panel__price">{product.priceLabel || 'Contact for quotation'}</p>
            </div>
            <div className="product-card__actions">
              <a
                className="btn btn--gold"
                href={buildWhatsAppUrl(business.whatsapp, productEnquiryMessage(product.name))}
                target="_blank"
                rel="noreferrer"
              >
                Ask on WhatsApp
              </a>
              <Link className="btn btn--secondary" to="/products">
                Explore Products
              </Link>
            </div>
          </div>
        </div>
      </div>

      {related.length ? (
        <section className="section">
          <div className="section__header">
            <h2>Related Products</h2>
          </div>
          <div className="product-grid">
            {related.map((item) => (
              <ProductCard key={item._id || item.slug} product={item} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
