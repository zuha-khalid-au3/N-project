import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
dotenv.config();

function requiredInProduction(name, fallback = '') {
  const value = process.env[name] ?? fallback;
  if (process.env.NODE_ENV === 'production' && !process.env[name]) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 5050),
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  mongodbUri: process.env.MONGODB_URI || '',
  jwtSecret: requiredInProduction('JWT_SECRET', 'dev-only-jwt-secret-change-me'),
  sessionSecret: requiredInProduction('SESSION_SECRET', 'dev-only-session-secret-change-me'),
  cookieName: process.env.COOKIE_NAME || 'nemat_gems_session',
  storageProvider: process.env.STORAGE_PROVIDER || 'local',
  r2: {
    accountId: process.env.R2_ACCOUNT_ID || '',
    accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
    bucketName: process.env.R2_BUCKET_NAME || '',
    publicBaseUrl: process.env.R2_PUBLIC_BASE_URL || '',
  },
  isProduction: process.env.NODE_ENV === 'production',
};
