import { useCallback, useState } from 'react';
import Cropper from 'react-easy-crop';
import { getCroppedImageBlob } from '../utils/cropImage.js';

const ASPECT_OPTIONS = [
  { label: 'Square 1:1', value: 1 },
  { label: 'Portrait 4:5', value: 4 / 5 },
  { label: 'Landscape 4:3', value: 4 / 3 },
  { label: 'Wide 16:9', value: 16 / 9 },
];

export default function ImageCropModal({
  imageSrc,
  fileName,
  originalFile,
  onCancel,
  onConfirm,
  onUploadOriginal,
}) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [aspect, setAspect] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const onCropComplete = useCallback((_area, pixels) => {
    setCroppedAreaPixels(pixels);
  }, []);

  async function handleConfirm() {
    if (!croppedAreaPixels) return;
    setBusy(true);
    setError('');
    try {
      const file = await getCroppedImageBlob(imageSrc, croppedAreaPixels, fileName);
      onConfirm(file);
    } catch (err) {
      setError(err.message || 'Unable to crop image.');
      setBusy(false);
    }
  }

  return (
    <div className="crop-modal" role="dialog" aria-modal="true" aria-label="Crop product image">
      <div className="crop-modal__panel">
        <div className="crop-modal__header">
          <div>
            <h2>Crop image</h2>
            <p>Adjust framing before upload so the product looks clean in the catalogue.</p>
          </div>
          <button type="button" className="btn btn--secondary" onClick={onCancel} disabled={busy}>
            Cancel
          </button>
        </div>

        <div className="crop-modal__stage">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
            showGrid
          />
        </div>

        <div className="crop-modal__controls">
          <label>
            Aspect
            <select value={aspect} onChange={(e) => setAspect(Number(e.target.value))}>
              {ASPECT_OPTIONS.map((option) => (
                <option key={option.label} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            Zoom
            <input
              type="range"
              min={1}
              max={3}
              step={0.05}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
            />
          </label>
        </div>

        {error ? <p className="field-error">{error}</p> : null}

        <div className="form-actions">
          <button type="button" className="btn btn--secondary" onClick={onCancel} disabled={busy}>
            Skip this image
          </button>
          <button
            type="button"
            className="btn btn--secondary"
            onClick={() => onUploadOriginal(originalFile)}
            disabled={busy || !originalFile}
          >
            Upload without crop
          </button>
          <button type="button" className="btn btn--gold" onClick={handleConfirm} disabled={busy}>
            {busy ? 'Preparing…' : 'Use cropped image'}
          </button>
        </div>
      </div>
    </div>
  );
}
