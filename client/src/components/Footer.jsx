import { Link } from 'react-router-dom';
import { useBusiness } from '../context/BusinessContext.jsx';

export default function Footer() {
  const business = useBusiness();

  return (
    <footer className="site-footer">
      <div className="site-footer__grid">
        <div>
          <img
            className="brand__wordmark brand__wordmark--footer"
            src="/assets/brand/nemat-gems-jewellery-logo-wordmark.png"
            alt="Nemat Gems and Jewellery"
          />
          <p>{business.tagline}</p>
        </div>
        <div>
          <h2>Products</h2>
          <ul>
            {business.categories.map((category) => (
              <li key={category}>
                <Link to={`/products?category=${encodeURIComponent(category)}`}>{category}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2>Contact</h2>
          <ul>
            <li>{business.phone}</li>
            <li>
              <a href={`mailto:${business.email}`}>{business.email}</a>
            </li>
            <li>{business.address}</li>
          </ul>
        </div>
      </div>
      <p className="site-footer__copy">
        © {business.name}. All rights reserved.
      </p>
    </footer>
  );
}
