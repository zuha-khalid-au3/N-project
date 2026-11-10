import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function AdminLayout() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    setNavOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.classList.toggle('admin-nav-lock', navOpen);
    return () => document.body.classList.remove('admin-nav-lock');
  }, [navOpen]);

  async function handleLogout() {
    await logout();
    navigate('/admin/login');
  }

  return (
    <div className={`admin-shell ${navOpen ? 'admin-shell--nav-open' : ''}`}>
      <aside className="admin-sidebar">
        <div className="admin-sidebar__top">
          <Link to="/admin" className="admin-brand">
            <img src="/assets/brand/nemat-gems-jewellery-emblem.png" alt="" />
            <span>Admin</span>
          </Link>
          <button
            type="button"
            className="admin-menu-toggle"
            aria-expanded={navOpen}
            aria-controls="admin-nav"
            onClick={() => setNavOpen((open) => !open)}
          >
            {navOpen ? 'Close' : 'Menu'}
          </button>
        </div>

        <nav id="admin-nav" className={navOpen ? 'is-open' : ''}>
          <NavLink to="/admin" end onClick={() => setNavOpen(false)}>
            Dashboard
          </NavLink>
          <NavLink to="/admin/products" end onClick={() => setNavOpen(false)}>
            Products
          </NavLink>
          <NavLink to="/admin/products/new" onClick={() => setNavOpen(false)}>
            Add Product
          </NavLink>
          <NavLink to="/admin/inquiries" onClick={() => setNavOpen(false)}>
            Enquiries
          </NavLink>
          <NavLink to="/" target="_blank" rel="noreferrer" onClick={() => setNavOpen(false)}>
            View Website
          </NavLink>
        </nav>

        <div className={`admin-sidebar__footer ${navOpen ? 'is-open' : ''}`}>
          <p>{user?.email}</p>
          <button type="button" className="btn btn--ghost" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </aside>

      {navOpen ? (
        <button
          type="button"
          className="admin-nav-backdrop"
          aria-label="Close menu"
          onClick={() => setNavOpen(false)}
        />
      ) : null}

      <div className="admin-content">
        <Outlet />
      </div>
    </div>
  );
}
