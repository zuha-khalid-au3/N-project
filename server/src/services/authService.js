import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AdminUser } from '../models/AdminUser.js';
import { env } from '../config/environment.js';

const COOKIE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

export function getAuthCookieOptions() {
  return {
    httpOnly: true,
    secure: env.isProduction,
    sameSite: env.isProduction ? 'none' : 'lax',
    maxAge: COOKIE_MAX_AGE_MS,
    path: '/',
  };
}

export async function authenticateAdmin(email, password) {
  const user = await AdminUser.findOne({ email: email.toLowerCase() }).select('+passwordHash');
  if (!user || !user.isActive) {
    return null;
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return null;
  }

  user.lastLoginAt = new Date();
  await user.save();

  const token = jwt.sign(
    { sub: user._id.toString(), role: user.role },
    env.jwtSecret,
    { expiresIn: '7d' }
  );

  return {
    token,
    user: {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    },
  };
}

export async function createAdminUser(email, password) {
  const existing = await AdminUser.findOne({ email: email.toLowerCase() });
  if (existing) {
    const error = new Error('An admin with this email already exists');
    error.statusCode = 409;
    error.code = 'DUPLICATE_ERROR';
    throw error;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await AdminUser.create({
    email: email.toLowerCase(),
    passwordHash,
    role: 'admin',
    isActive: true,
  });

  return {
    id: user._id.toString(),
    email: user.email,
    role: user.role,
  };
}
