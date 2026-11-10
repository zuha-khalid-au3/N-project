import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ProductForm from '../../components/ProductForm.jsx';
import Seo from '../../components/Seo.jsx';
import StatusMessage from '../../components/StatusMessage.jsx';
import { fetchAdminProduct, updateProduct } from '../../services/productService.js';

export default function ProductEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchAdminProduct(id)
      .then((response) => setProduct(response.data.product))
      .catch(() => setError('Product not found.'))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleSubmit(payload) {
    const response = await updateProduct(id, payload);
    setProduct(response.data.product);
    setMessage('Product updated successfully.');
  }

  if (loading) {
    return (
      <div className="admin-page">
        <StatusMessage>Loading product…</StatusMessage>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="admin-page">
        <StatusMessage tone="error">{error || 'Product not found.'}</StatusMessage>
        <button type="button" className="btn btn--secondary" onClick={() => navigate('/admin')}>
          Back to dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <Seo title={`Edit ${product.name}`} path={`/admin/products/${id}/edit`} />
      <div className="admin-page__header">
        <div>
          <h1>Edit Product</h1>
          <p>{product.name}</p>
        </div>
      </div>
      {message ? <StatusMessage tone="success">{message}</StatusMessage> : null}
      <ProductForm initialValues={product} onSubmit={handleSubmit} submitLabel="Save Draft" />
    </div>
  );
}
