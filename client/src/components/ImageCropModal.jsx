import { useCallback, useState } from 'react';
import Cropper from 'react-easy-crop';
import { getCroppedImageBlob } from '../utils/cropImage.js';

const ASPECT_OPTIONS = [
  { label: '1:1', value: 1 },
  { label: '4:5', value: 4 / 5 },
  { label: '4:3', value: 4 / 3 },
  { label: '16:9', value: 16 / 9 },
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
            <p className="crop-modal__eyebrow">Optional</p>
            <h2>Frame the product</h2>
            <p>Pinch or drag to adjust. Or skip crop and upload as-is.</p>
          </div>
          <button type="button" className="btn btn--secondary" onClick={onCancel} disabled={busy}>
            Close
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
          <div className="crop-aspect-row" role="group" aria-label="Aspect ratio">
            {ASPECT_OPTIONS.map((option) => (
              <button
                key={option.label}
                type="button"
                className={`crop-aspect-chip ${aspect === option.value ? 'is-active' : ''}`}
                onClick={() => setAspect(option.value)}
                disabled={busy}
              >
                {option.label}
              </button>
            ))}
          </div>
          <label className="crop-zoom">
            <span>Zoom</span>
            <input
              type="range"
              min={1}
              max={3}
              step={0.05}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              disabled={busy}
            />
          </label>
        </div>

        {error ? <p className="field-error">{error}</p> : null}

        <div className="crop-modal__actions">
          <button
            type="button"
            className="btn btn--gold"
            onClick={handleConfirm}
            disabled={busy}
          >
            {busy ? 'Preparing…' : 'Use this crop'}
          </button>
          <button
            type="button"
            className="btn btn--secondary"
            onClick={() => onUploadOriginal(originalFile)}
            disabled={busy || !originalFile}
          >
            Upload without crop
          </button>
          <button type="button" className="btn btn--ghost" onClick={onCancel} disabled={busy}>
            Skip this photo
          </button>
        </div>
      </div>
    </div>
  );
}
