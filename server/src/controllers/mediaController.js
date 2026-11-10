import { getStoredObject } from '../services/storageService.js';

// 1x1 gray PNG — keeps <img> tags valid when a file is missing (avoids JSON/ORB blocks).
const PLACEHOLDER_PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO5W2fQAAAAASUVORK5CYII=',
  'base64'
);

function wantsImage(req) {
  const accept = String(req.headers.accept || '');
  const key = String(req.params[0] || '');
  return (
    accept.includes('image/') ||
    /\.(png|jpe?g|webp|gif|avif|svg)$/i.test(key) ||
    req.headers['sec-fetch-dest'] === 'image'
  );
}

export async function serveUpload(req, res, next) {
  try {
    const storageKey = req.params[0];
    if (!storageKey) {
      if (wantsImage(req)) {
        res.setHeader('Content-Type', 'image/png');
        res.setHeader('Cache-Control', 'public, max-age=60');
        res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
        return res.status(404).end(PLACEHOLDER_PNG);
      }
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Image not found' },
      });
    }

    const file = await getStoredObject(storageKey);
    if (!file) {
      if (wantsImage(req)) {
        res.setHeader('Content-Type', 'image/png');
        res.setHeader('Cache-Control', 'public, max-age=60');
        res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
        return res.status(404).end(PLACEHOLDER_PNG);
      }
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Image not found' },
      });
    }

    res.setHeader('Content-Type', file.contentType);
    res.setHeader('Content-Length', String(file.size));
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    return res.status(200).end(file.data);
  } catch (error) {
    return next(error);
  }
}
