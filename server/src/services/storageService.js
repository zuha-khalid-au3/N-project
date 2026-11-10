import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { randomUUID } from 'crypto';
import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { env } from '../config/environment.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const localUploadDir = path.resolve(__dirname, '../../uploads');

const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp']);
const MAX_BYTES = 5 * 1024 * 1024;

let r2Client;

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

function isR2Enabled() {
  return (
    env.storageProvider === 'cloudflare_r2' &&
    Boolean(env.r2.accountId) &&
    Boolean(env.r2.accessKeyId) &&
    Boolean(env.r2.secretAccessKey) &&
    Boolean(env.r2.bucketName) &&
    Boolean(env.r2.publicBaseUrl)
  );
}

function getR2Client() {
  if (!r2Client) {
    r2Client = new S3Client({
      region: 'auto',
      endpoint: `https://${env.r2.accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: env.r2.accessKeyId,
        secretAccessKey: env.r2.secretAccessKey,
      },
    });
  }
  return r2Client;
}

function publicUrlForKey(storageKey) {
  if (isR2Enabled()) {
    return `${env.r2.publicBaseUrl.replace(/\/$/, '')}/${storageKey}`;
  }
  return `/uploads/${storageKey}`;
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

  return {
    mode: 'server_upload',
    storageKey,
    uploadUrl: '/api/admin/uploads',
    publicUrl: publicUrlForKey(storageKey),
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

  if (isR2Enabled()) {
    await getR2Client().send(
      new PutObjectCommand({
        Bucket: env.r2.bucketName,
        Key: storageKey,
        Body: file.buffer,
        ContentType: file.mimetype,
      })
    );

    return {
      storageKey,
      url: publicUrlForKey(storageKey),
    };
  }

  if (env.storageProvider === 'cloudflare_r2') {
    console.warn(
      'STORAGE_PROVIDER=cloudflare_r2 but R2 env vars are incomplete; falling back to local disk (not durable on Render).'
    );
  }

  await ensureLocalUploadDir();
  const absolutePath = path.join(localUploadDir, storageKey);
  await fs.mkdir(path.dirname(absolutePath), { recursive: true });
  await fs.writeFile(absolutePath, file.buffer);

  return {
    storageKey,
    url: publicUrlForKey(storageKey),
  };
}

export async function deleteStoredObject(storageKey) {
  if (!storageKey) return;
  assertSafeKey(storageKey);

  if (isR2Enabled()) {
    try {
      await getR2Client().send(
        new DeleteObjectCommand({
          Bucket: env.r2.bucketName,
          Key: storageKey,
        })
      );
    } catch (error) {
      console.error('Failed to delete R2 object', storageKey, error.message);
    }
    return;
  }

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
