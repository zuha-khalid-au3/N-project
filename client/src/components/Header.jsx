import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useBusiness } from '../context/BusinessContext.jsx';
import { buildWhatsAppUrl, generalQuoteMessage } from '../utils/whatsapp.js';

const links = [
  { to: '/', label: 'Home' },
  { to: '/products', label: 'Products' },
  { to: '/about', label: 'About Us' },
  { to: '/contact', label: 'Contact' },
];

export default function Header() {
  const business = useBusiness();
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link to="/" className="brand" onClick={() => setOpen(false)}>
          <img
            className="brand__wordmark"
            src="/assets/brand/nemat-gems-jewellery-logo-wordmark.png"
            alt="Nemat Gems and Jewellery"
          />
          <img
            className="brand__emblem"
            src="/assets/brand/nemat-gems-jewellery-emblem.png"
            alt="Nemat Gems and Jewellery"
          />
        </Link>

        <button
          className="menu-toggle"
          type="button"
          aria-expanded={open}
          aria-controls="primary-nav"
          onClick={() => setOpen((value) => !value)}
        >
          Menu
        </button>

        <nav id="primary-nav" className={`primary-nav ${open ? 'is-open' : ''}`}>
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.to === '/'} onClick={() => setOpen(false)}>
              {link.label}
            </NavLink>
          ))}
          <a
            className="btn btn--gold"
            href={buildWhatsAppUrl(business.whatsapp, generalQuoteMessage())}
            target="_blank"
            rel="noreferrer"
            onClick={() => setOpen(false)}
          >
            Chat on WhatsApp
          </a>
        </nav>
      </div>
    </header>
  );
}
