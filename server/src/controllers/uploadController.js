import { createUploadIntent, saveUploadedFile, deleteStoredObject } from '../services/storageService.js';
import { failure, success } from '../utils/response.js';

export async function signUpload(req, res, next) {
  try {
    const { filename, contentType, size } = req.body || {};
    if (!filename || !contentType || typeof size !== 'number') {
      return failure(res, 'VALIDATION_ERROR', 'filename, contentType, and size are required', 400);
    }
    const intent = await createUploadIntent({ filename, contentType, size });
    return success(res, { intent });
  } catch (error) {
    return next(error);
  }
}

export async function uploadFile(req, res, next) {
  try {
    if (!req.file) {
      return failure(res, 'VALIDATION_ERROR', 'Image file is required', 400);
    }
    const preferredKey = req.body?.storageKey || undefined;
    const saved = await saveUploadedFile(req.file, preferredKey);
    return success(
      res,
      {
        image: {
          url: saved.url,
          storageKey: saved.storageKey,
          altText: req.body?.altText || '',
          sortOrder: Number(req.body?.sortOrder || 0),
        },
      },
      'Image uploaded successfully',
      201
    );
  } catch (error) {
    return next(error);
  }
}

export async function deleteUpload(req, res, next) {
  try {
    const { storageKey } = req.body || {};
    if (!storageKey) {
      return failure(res, 'VALIDATION_ERROR', 'storageKey is required', 400);
    }
    await deleteStoredObject(storageKey);
    return success(res, {}, 'Upload deleted successfully');
  } catch (error) {
    return next(error);
  }
}
