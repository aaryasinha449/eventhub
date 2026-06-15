import { HttpError } from './error.js';

export function requireRole(...roles) {
  return (req, _res, next) => {
    if (!req.user) return next(new HttpError(401, 'Authentication required', 'unauthenticated'));
    if (!roles.includes(req.user.role)) {
      return next(new HttpError(403, 'Forbidden', 'forbidden'));
    }
    next();
  };
}
