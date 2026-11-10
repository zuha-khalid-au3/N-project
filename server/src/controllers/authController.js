import { env } from '../config/environment.js';
import { authenticateAdmin, getAuthCookieOptions } from '../services/authService.js';
import { failure, success } from '../utils/response.js';

export async function login(req, res, next) {
  try {
    const result = await authenticateAdmin(req.body.email, req.body.password);
    if (!result) {
      return failure(res, 'INVALID_CREDENTIALS', 'Invalid email or password', 401);
    }

    res.cookie(env.cookieName, result.token, getAuthCookieOptions());
    // Return token for cross-origin SPA auth (workers.dev → Render); cookies alone are unreliable.
    return success(res, { user: result.user, token: result.token }, 'Logged in successfully');
  } catch (error) {
    return next(error);
  }
}

export async function logout(req, res) {
  res.clearCookie(env.cookieName, {
    ...getAuthCookieOptions(),
    maxAge: 0,
  });
  return success(res, {}, 'Logged out successfully');
}

export async function me(req, res) {
  return success(res, { user: req.user });
}
