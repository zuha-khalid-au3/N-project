import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { randomUUID } from 'crypto';
import { env } from '../config/environment.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const localUploadDir = path.resolve(__dirname, '../../uploads');

const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp']);
const MAX_BYTES = 5 * 1024 * 1024;

function sanitizeFilename(name) {
  return name.replace(/[^a-zA-Z0-9._-]/g, '_').replace(/\.+/g, '.');
}

function assertSafeKey(storageKey) {
  if (!storageKey || storageKey.includes('..') || storageKey.startsWith('/') || storageKey.includes('\\')) {
    const error = new Error('Invalid storage key');
    error.statusCode = 400;
    error.code = 'INVALID_STORAGE_KEY';
    throw error;
  }
}

export function validateImageFile({ mimetype, size, originalname }) {
  if (!ALLOWED_MIME.has(mimetype)) {
    const error = new Error('Only JPEG, PNG, and WebP images are allowed');
    error.statusCode = 400;
    error.code = 'INVALID_FILE_TYPE';
    throw error;
  }
  if (size > MAX_BYTES) {
    const error = new Error('Each image must be 5 MB or smaller');
    error.statusCode = 400;
    error.code = 'FILE_TOO_LARGE';
    throw error;
  }
  const ext = path.extname(originalname || '').toLowerCase();
  if (!['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
    const error = new Error('Invalid image extension');
    error.statusCode = 400;
    error.code = 'INVALID_FILE_EXTENSION';
    throw error;
  }
}

export async function ensureLocalUploadDir() {
  await fs.mkdir(localUploadDir, { recursive: true });
}

export async function createUploadIntent({ filename, contentType, size }) {
  validateImageFile({ mimetype: contentType, size, originalname: filename });

  const safeName = sanitizeFilename(filename || 'image.webp');
  const storageKey = `products/${randomUUID()}-${safeName}`;

  if (env.storageProvider === 'cloudflare_r2') {
    // Signed direct-to-R2 uploads require AWS SDK credentials.
    // Until R2 is fully wired, return a server-mediated upload path.
    return {
      mode: 'server_upload',
      storageKey,
      uploadUrl: '/api/admin/uploads',
      publicUrl: `${env.r2.publicBaseUrl.replace(/\/$/, '')}/${storageKey}`,
      headers: { 'Content-Type': contentType },
    };
  }

  return {
    mode: 'server_upload',
    storageKey,
    uploadUrl: '/api/admin/uploads',
    publicUrl: `/uploads/${storageKey}`,
    headers: { 'Content-Type': contentType },
  };
}

export async function saveUploadedFile(file, preferredKey) {
  validateImageFile({
    mimetype: file.mimetype,
    size: file.size,
    originalname: file.originalname,
  });

  const storageKey =
    preferredKey ||
    `products/${randomUUID()}-${sanitizeFilename(file.originalname || 'image.webp')}`;
  assertSafeKey(storageKey);

  if (env.storageProvider === 'cloudflare_r2' && env.r2.bucketName && env.r2.publicBaseUrl) {
    // Placeholder for R2 putObject integration. Local fallback keeps the app runnable.
    console.warn('R2 credentials present but SDK upload is not configured; storing locally for now.');
  }

  await ensureLocalUploadDir();
  const absolutePath = path.join(localUploadDir, storageKey);
  await fs.mkdir(path.dirname(absolutePath), { recursive: true });
  await fs.writeFile(absolutePath, file.buffer);

  return {
    storageKey,
    url: `/uploads/${storageKey}`,
  };
}

export async function deleteStoredObject(storageKey) {
  if (!storageKey) return;
  assertSafeKey(storageKey);

  const absolutePath = path.join(localUploadDir, storageKey);
  try {
    await fs.unlink(absolutePath);
  } catch (error) {
    if (error.code !== 'ENOENT') {
      throw error;
    }
  }
}

export { localUploadDir };
