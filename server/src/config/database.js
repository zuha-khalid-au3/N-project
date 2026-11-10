import mongoose from 'mongoose';
import { env } from './environment.js';

function normalizeMongoUri(rawUri) {
  const uri = String(rawUri || '').trim().replace(/^['"]|['"]$/g, '');
  return uri;
}

export async function connectDatabase() {
  const mongodbUri = normalizeMongoUri(env.mongodbUri);

  if (!mongodbUri) {
    throw new Error(
      'MONGODB_URI is missing. In Render → Environment, set MONGODB_URI to a full connection string starting with mongodb+srv://'
    );
  }

  if (!mongodbUri.startsWith('mongodb://') && !mongodbUri.startsWith('mongodb+srv://')) {
    throw new Error(
      'MONGODB_URI is invalid. It must start with mongodb:// or mongodb+srv:// (no quotes, no missing prefix).'
    );
  }

  mongoose.set('strictQuery', true);
  await mongoose.connect(mongodbUri);
  console.log('Connected to MongoDB');
  return mongoose.connection;
}
