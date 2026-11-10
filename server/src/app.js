import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import { env } from './config/environment.js';
import { businessConfig } from './config/business.js';
import { getHealth } from './controllers/productController.js';
import { errorHandler, notFoundHandler } from './middleware/errorMiddleware.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import inquiryRoutes from './routes/inquiryRoutes.js';
import { serveUpload } from './controllers/mediaController.js';
import { localUploadDir } from './services/storageService.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function createApp() {
  const app = express();

  app.set('trust proxy', 1);
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    })
  );
  app.use(
    cors({
      origin(origin, callback) {
        // Allow non-browser requests (no Origin) and configured frontend origins.
        if (!origin || env.allowedOrigins.includes(origin)) {
          return callback(null, true);
        }
        return callback(null, false);
      },
      credentials: true,
    })
  );
  app.use(morgan(env.isProduction ? 'combined' : 'dev'));
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));
  app.use(cookieParser(env.sessionSecret));

  // Serve durable MongoDB-backed images first, then local disk fallback.
  app.get('/uploads/*storageKey', (req, res, next) => {
    const wildcard = req.params.storageKey;
    req.params[0] = Array.isArray(wildcard) ? wildcard.join('/') : String(wildcard || '');
    return serveUpload(req, res, next);
  });
  app.use('/uploads', express.static(localUploadDir));

  app.get('/api/health', getHealth);
  app.get('/api/business', (req, res) => {
    res.json({ success: true, data: { business: businessConfig }, message: 'OK' });
  });

  app.use('/api/auth', authRoutes);
  app.use('/api', productRoutes);
  app.use('/api', uploadRoutes);
  app.use('/api', inquiryRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

export { __dirname };
