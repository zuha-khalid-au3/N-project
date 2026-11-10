import { useNavigate } from 'react-router-dom';
import ProductForm from '../../components/ProductForm.jsx';
import Seo from '../../components/Seo.jsx';
import StatusMessage from '../../components/StatusMessage.jsx';
import { createProduct } from '../../services/productService.js';
import { useState } from 'react';

export default function ProductCreate() {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');

  async function handleSubmit(payload) {
    const response = await createProduct(payload);
    setMessage('Product saved successfully.');
    navigate(`/admin/products/${response.data.product._id}/edit`);
  }

  return (
    <div className="admin-page">
      <Seo title="Add Product" path="/admin/products/new" />
      <div className="admin-page__header">
        <div>
          <h1>Add Product</h1>
          <p>Create a draft or publish immediately.</p>
        </div>
      </div>
      {message ? <StatusMessage tone="success">{message}</StatusMessage> : null}
      <ProductForm onSubmit={handleSubmit} submitLabel="Save Draft" />
    </div>
  );
}
