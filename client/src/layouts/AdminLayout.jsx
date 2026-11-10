import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function AdminLayout() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/admin/login');
  }

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Link to="/admin" className="admin-brand">
          <img src="/assets/brand/nemat-gems-jewellery-emblem.png" alt="" />
          <span>Admin</span>
        </Link>
        <nav>
          <NavLink to="/admin" end>
            Dashboard
          </NavLink>
          <NavLink to="/admin/products" end>
            Products
          </NavLink>
          <NavLink to="/admin/products/new">Add Product</NavLink>
          <NavLink to="/admin/inquiries">Enquiries</NavLink>
          <NavLink to="/" target="_blank">
            View Website
          </NavLink>
        </nav>
        <div className="admin-sidebar__footer">
          <p>{user?.email}</p>
          <button type="button" className="btn btn--ghost" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </aside>
      <div className="admin-content">
        <Outlet />
      </div>
    </div>
  );
}
