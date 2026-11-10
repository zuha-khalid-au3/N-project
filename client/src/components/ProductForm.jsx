import { useState } from 'react';
import ImageCropModal from './ImageCropModal.jsx';
import StatusMessage from './StatusMessage.jsx';
import { useBusiness } from '../context/BusinessContext.jsx';
import { uploadProductImage } from '../services/productService.js';
import { resolveImageUrl } from '../utils/format.js';

const emptyForm = {
  name: '',
  sku: '',
  category: '',
  material: '',
  color: '',
  shape: '',
  size: '',
  finish: '',
  description: '',
  moq: '',
  priceLabel: 'Contact for quotation',
  stockStatus: 'made_to_order',
  status: 'draft',
  featured: false,
  images: [],
  seo: { title: '', description: '' },
};

export default function ProductForm({ initialValues, onSubmit, submitLabel = 'Save Draft' }) {
  const business = useBusiness();
  const [form, setForm] = useState({ ...emptyForm, ...initialValues });
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [cropQueue, setCropQueue] = useState([]);

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function onFileInputChange(event) {
    const files = Array.from(event.target.files || []);
    event.target.value = '';
    if (!files.length) return;

    if (form.images.length + files.length > 8) {
      setError('Maximum 8 images per product.');
      return;
    }

    setError('');
    setCropQueue(
      files.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }))
    );
  }

  async function uploadCroppedFile(file) {
    setUploading(true);
    setError('');
    try {
      const response = await uploadProductImage(file, {
        altText: form.name || file.name,
        sortOrder: form.images.length,
        onProgress: setProgress,
      });
      setForm((prev) => ({ ...prev, images: [...prev.images, response.data.image] }));
    } catch (err) {
      setError(err.message || 'Image upload failed. Check file type (JPG/PNG/WebP) and size.');
    } finally {
      setUploading(false);
      setProgress(0);
    }
  }

  async function handleCropConfirm(croppedFile) {
    const [current, ...remaining] = cropQueue;
    if (current?.preview) URL.revokeObjectURL(current.preview);
    setCropQueue(remaining);
    await uploadCroppedFile(croppedFile);
  }

  function handleCropCancel() {
    const [current, ...remaining] = cropQueue;
    if (current?.preview) URL.revokeObjectURL(current.preview);
    setCropQueue(remaining);
  }

  function removeImage(storageKey) {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((image) => image.storageKey !== storageKey),
    }));
  }

  function moveImage(index, direction) {
    setForm((prev) => {
      const images = [...prev.images];
      const target = index + direction;
      if (target < 0 || target >= images.length) return prev;
      const temp = images[index];
      images[index] = images[target];
      images[target] = temp;
      return {
        ...prev,
        images: images.map((image, sortOrder) => ({ ...image, sortOrder })),
      };
    });
  }

  async function handleSubmit(event, statusOverride) {
    event.preventDefault();
    setSaving(true);
    setError('');
    setFieldErrors({});
    try {
      const payload = {
        ...form,
        status: statusOverride || form.status,
        images: form.images.map((image, sortOrder) => ({
          ...image,
          sortOrder,
          altText: image.altText || form.name,
        })),
      };
      await onSubmit(payload);
    } catch (err) {
      const fields = err.fields || {};
      setFieldErrors(fields);
      const fieldMessages = Object.values(fields).filter(Boolean);
      setError(
        err.message ||
          (fieldMessages.length ? fieldMessages.join(' · ') : 'Unable to save product.')
      );
    } finally {
      setSaving(false);
    }
  }

  function fieldError(key) {
    return fieldErrors[key] ? <span className="field-error">{fieldErrors[key]}</span> : null;
  }

  const activeCrop = cropQueue[0];
  const imagesError =
    fieldErrors.images ||
    Object.entries(fieldErrors).find(([key]) => key.startsWith('images.'))?.[1];

  return (
    <form className="product-form" onSubmit={(e) => handleSubmit(e)}>
      {error ? <StatusMessage tone="error">{error}</StatusMessage> : null}

      {activeCrop ? (
        <ImageCropModal
          imageSrc={activeCrop.preview}
          fileName={activeCrop.file.name}
          originalFile={activeCrop.file}
          onCancel={handleCropCancel}
          onConfirm={handleCropConfirm}
          onUploadOriginal={handleCropConfirm}
        />
      ) : null}

      <section>
        <h2>Basic information</h2>
        <div className="form-grid">
          <label>
            Product name
            <input required value={form.name} onChange={(e) => updateField('name', e.target.value)} />
            {fieldError('name')}
          </label>
          <label>
            SKU
            <input value={form.sku} onChange={(e) => updateField('sku', e.target.value)} />
            {fieldError('sku')}
          </label>
          <label>
            Category
            <select
              required
              value={form.category}
              onChange={(e) => updateField('category', e.target.value)}
            >
              <option value="">Select category</option>
              {business.categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {fieldError('category')}
          </label>
          <label>
            Description
            <textarea
              required
              rows={5}
              value={form.description}
              onChange={(e) => updateField('description', e.target.value)}
            />
            {fieldError('description')}
          </label>
        </div>
      </section>

      <section>
        <h2>Specifications</h2>
        <div className="form-grid">
          {[
            ['material', 'Material'],
            ['color', 'Colour'],
            ['shape', 'Shape'],
            ['size', 'Size'],
            ['finish', 'Finish'],
            ['moq', 'Minimum order quantity'],
            ['priceLabel', 'Price label'],
          ].map(([key, label]) => (
            <label key={key}>
              {label}
              <input value={form[key]} onChange={(e) => updateField(key, e.target.value)} />
              {fieldError(key)}
            </label>
          ))}
          <label>
            Stock status
            <select
              value={form.stockStatus}
              onChange={(e) => updateField('stockStatus', e.target.value)}
            >
              <option value="in_stock">In stock</option>
              <option value="made_to_order">Made to order</option>
              <option value="out_of_stock">Out of stock</option>
            </select>
            {fieldError('stockStatus')}
          </label>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => updateField('featured', e.target.checked)}
            />
            Featured product
          </label>
        </div>
      </section>

      <section className="image-uploader">
        <div className="image-uploader__header">
          <div>
            <h2>Images</h2>
            <p className="lead">
              Add up to 8 photos. First image is the cover. Crop optional.
            </p>
          </div>
          <span className="image-uploader__count">
            {form.images.length}/8
          </span>
        </div>
        {imagesError ? <span className="field-error">{imagesError}</span> : null}

        <label
          className={`image-dropzone ${uploading || activeCrop ? 'is-disabled' : ''}`}
        >
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={onFileInputChange}
            disabled={uploading || Boolean(activeCrop) || form.images.length >= 8}
          />
          <strong>Tap to add photos</strong>
          <span>JPG, PNG or WebP · phone camera or gallery</span>
        </label>

        {uploading ? (
          <div className="upload-progress" role="status" aria-live="polite">
            <div className="upload-progress__meta">
              <strong>Uploading photo…</strong>
              <span>{progress}%</span>
            </div>
            <div className="upload-progress__track">
              <div className="upload-progress__bar" style={{ width: `${progress}%` }} />
            </div>
          </div>
        ) : null}

        {cropQueue.length > 1 ? (
          <StatusMessage>
            Cropping image {form.images.length + 1} of {form.images.length + cropQueue.length}
          </StatusMessage>
        ) : null}

        {form.images.length === 0 && !uploading ? (
          <p className="image-uploader__empty">No photos yet. Add at least one before publishing.</p>
        ) : null}

        <div className="image-manager">
          {form.images.map((image, index) => (
            <div key={image.storageKey} className="image-manager__item">
              <div className="image-manager__preview">
                <img src={resolveImageUrl(image.url)} alt={image.altText || form.name} />
                {index === 0 ? <span className="image-manager__badge">Cover</span> : null}
              </div>
              <label>
                Alt text
                <input
                  value={image.altText || ''}
                  onChange={(e) => {
                    const altText = e.target.value;
                    setForm((prev) => ({
                      ...prev,
                      images: prev.images.map((item) =>
                        item.storageKey === image.storageKey ? { ...item, altText } : item
                      ),
                    }));
                  }}
                  placeholder={form.name || 'Describe this photo'}
                />
              </label>
              <div className="image-manager__actions">
                <button type="button" disabled={index === 0} onClick={() => moveImage(index, -1)}>
                  Move up
                </button>
                <button
                  type="button"
                  disabled={index === form.images.length - 1}
                  onClick={() => moveImage(index, 1)}
                >
                  Move down
                </button>
                <button
                  type="button"
                  className="image-manager__remove"
                  onClick={() => removeImage(image.storageKey)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2>SEO</h2>
        <div className="form-grid">
          <label>
            SEO title
            <input
              value={form.seo?.title || ''}
              onChange={(e) => updateField('seo', { ...form.seo, title: e.target.value })}
            />
            {fieldError('seo.title')}
          </label>
          <label>
            SEO description
            <textarea
              rows={3}
              value={form.seo?.description || ''}
              onChange={(e) => updateField('seo', { ...form.seo, description: e.target.value })}
            />
            {fieldError('seo.description')}
          </label>
        </div>
      </section>

      <section>
        <h2>Publishing</h2>
        <label>
          Status
          <select value={form.status} onChange={(e) => updateField('status', e.target.value)}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="hidden">Hidden</option>
          </select>
          {fieldError('status')}
        </label>
      </section>

      <div className="form-actions">
        <button className="btn btn--secondary" type="submit" disabled={saving || uploading}>
          {saving ? 'Saving…' : submitLabel}
        </button>
        <button
          className="btn btn--gold"
          type="button"
          disabled={saving || uploading}
          onClick={(e) => handleSubmit(e, 'published')}
        >
          Publish Product
        </button>
      </div>
    </form>
  );
}
