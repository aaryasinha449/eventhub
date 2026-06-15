import crypto from 'crypto';

export function generateTicketCode(prefix = 'EVH') {
  const r = crypto.randomBytes(5).toString('hex').toUpperCase().slice(0, 8);
  return `${prefix}-${r.slice(0, 3)}-${r.slice(3)}`;
}

export function slugify(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 120);
}
