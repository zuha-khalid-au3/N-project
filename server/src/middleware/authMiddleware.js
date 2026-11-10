import jwt from 'jsonwebtoken';
import { env } from '../config/environment.js';
import { AdminUser } from '../models/AdminUser.js';
import { failure } from '../utils/response.js';

export async function requireAuth(req, res, next) {
  try {
    const token = req.cookies?.[env.cookieName];
    if (!token) {
      return failure(res, 'UNAUTHORIZED', 'Authentication required', 401);
    }

    let payload;
    try {
      payload = jwt.verify(token, env.jwtSecret);
    } catch {
      return failure(res, 'UNAUTHORIZED', 'Authentication required', 401);
    }

    const user = await AdminUser.findById(payload.sub);
    if (!user || !user.isActive || user.role !== 'admin') {
      return failure(res, 'UNAUTHORIZED', 'Authentication required', 401);
    }

    req.user = {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    };
    return next();
  } catch (error) {
    return next(error);
  }
}
