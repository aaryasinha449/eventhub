import { verifyToken } from '../utils/token.js';
import { User } from '../models/User.js';
import { HttpError } from './error.js';

export async function requireAuth(req, _res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) throw new HttpError(401, 'Authentication required', 'unauthenticated');
    const payload = verifyToken(token);
    const user = await User.findById(payload.sub);
    if (!user) throw new HttpError(401, 'Account not found', 'unauthenticated');
    req.user = user;
    next();
  } catch (err) {
    if (err instanceof HttpError) return next(err);
    next(new HttpError(401, 'Invalid or expired token', 'unauthenticated'));
  }
}
