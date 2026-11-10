import { getStoredObject } from '../services/storageService.js';
import { failure } from '../utils/response.js';

export async function serveUpload(req, res, next) {
  try {
    const storageKey = req.params[0];
    if (!storageKey) {
      return failure(res, 'NOT_FOUND', 'Image not found', 404);
    }

    const file = await getStoredObject(storageKey);
    if (!file) {
      return failure(res, 'NOT_FOUND', 'Image not found', 404);
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
