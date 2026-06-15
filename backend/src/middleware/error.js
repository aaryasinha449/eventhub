export class HttpError extends Error {
  constructor(status, message, code = 'error', details) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export function notFoundHandler(_req, res) {
  res.status(404).json({ message: 'Not found', code: 'not_found' });
}

export function errorHandler(err, _req, res, _next) {
  if (err?.name === 'ZodError') {
    return res.status(400).json({ message: 'Validation failed', code: 'validation_error', details: err.errors });
  }
  if (err instanceof HttpError) {
    return res.status(err.status).json({ message: err.message, code: err.code, details: err.details });
  }
  if (err?.code === 11000) {
    return res.status(409).json({ message: 'Duplicate value', code: 'duplicate' });
  }
  console.error('[error]', err);
  res.status(500).json({ message: 'Internal server error', code: 'internal_error' });
}
