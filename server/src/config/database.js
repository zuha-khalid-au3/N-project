import mongoose from 'mongoose';
import { env } from './environment.js';

export async function connectDatabase() {
  if (!env.mongodbUri) {
    console.warn('MONGODB_URI is not set. API routes that need the database will fail until it is configured.');
    return null;
  }

  mongoose.set('strictQuery', true);
  await mongoose.connect(env.mongodbUri);
  console.log('Connected to MongoDB');
  return mongoose.connection;
}
