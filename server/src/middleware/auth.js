const jwt = require('jsonwebtoken');

if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET) {
  console.error('[SECURITY CRITICAL] JWT_SECRET must be configured via environment variables in production.');
}

const JWT_SECRET = process.env.JWT_SECRET || 'dukaan_dev_jwt_secret_token_local_only';

function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      status: 'error',
      message: 'Access denied. No authentication token provided.',
    });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      status: 'error',
      message: 'Invalid or expired session token. Please sign in again.',
    });
  }
}

module.exports = {
  requireAuth,
  JWT_SECRET,
};
