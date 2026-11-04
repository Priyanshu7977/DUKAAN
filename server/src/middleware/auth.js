const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'dukaan_production_secret_key_change_in_env_9921!';

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
    req.user = decoded; // { id, email, role }
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
