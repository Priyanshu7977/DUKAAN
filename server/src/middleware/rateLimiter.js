const rateLimit = require('express-rate-limit');

// Strict limiter for authentication & OTP (anti-brute-force & anti-SMS-bomb)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 'error',
    message: 'Too many authentication attempts from this IP. Please wait 15 minutes before retrying.',
  },
});

// General API Rate Limiter
const generalLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 120, // 120 requests per minute
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 'error',
    message: 'Too many requests, please slow down.',
  },
});

// Order placement limiter (prevent automated card testing / spam orders)
const orderLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 10,
  message: {
    status: 'error',
    message: 'Order creation rate limit reached. Please wait a few moments.',
  },
});

module.exports = {
  authLimiter,
  generalLimiter,
  orderLimiter,
};
