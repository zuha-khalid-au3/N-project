import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { BusinessProvider } from './context/BusinessContext.jsx';
import AdminLayout from './layouts/AdminLayout.jsx';
import PublicLayout from './layouts/PublicLayout.jsx';
import About from './pages/About.jsx';
import Contact from './pages/Contact.jsx';
import Home from './pages/Home.jsx';
import ProductDetails from './pages/ProductDetails.jsx';
import Products from './pages/Products.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import AdminLogin from './pages/admin/AdminLogin.jsx';
import ProductCreate from './pages/admin/ProductCreate.jsx';
import ProductEdit from './pages/admin/ProductEdit.jsx';
import ProtectedRoute from './routes/ProtectedRoute.jsx';

export default function App() {
  return (
    <AuthProvider>
      <BusinessProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:slug" element={<ProductDetails />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
            </Route>

            <Route path="/admin/login" element={<AdminLogin />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="products/new" element={<ProductCreate />} />
                <Route path="products/:id/edit" element={<ProductEdit />} />
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </BusinessProvider>
    </AuthProvider>
  );
}
