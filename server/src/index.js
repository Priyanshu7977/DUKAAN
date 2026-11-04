const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const orderRoutes = require('./routes/orders');
const notificationRoutes = require('./routes/notifications');
const { generalLimiter } = require('./middleware/rateLimiter');

process.on('unhandledRejection', (reason, promise) => {
  console.error('[Process Alert] Unhandled Promise Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('[Process Alert] Uncaught Exception thrown:', err);
});

const app = express();
const PORT = process.env.PORT || 5000;
const INSTANCE_ID = process.env.INSTANCE_ID || `node-instance-${process.pid}`;

app.use(helmet());

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
        callback(null, true);
      } else {
        const err = new Error('Blocked by CORS security policy.');
        err.name = 'CorsError';
        callback(err);
      }
    },
    credentials: true,
  })
);

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

app.use('/api/', generalLimiter);

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    instance: INSTANCE_ID,
    uptimeSeconds: Math.floor(process.uptime()),
    memoryUsageMB: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/notifications', notificationRoutes);

app.use((req, res) => {
  res.status(404).json({ status: 'error', message: 'API endpoint not found.' });
});

app.use((err, req, res, next) => {
  if (err.name === 'CorsError') {
    return res.status(403).json({ status: 'error', message: 'Access denied by CORS security policy.' });
  }

  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ status: 'error', message: 'Malformed JSON payload detected.' });
  }

  console.error('[Unhandled Server Exception]:', err.message || err);
  res.status(500).json({ status: 'error', message: 'Internal server error occurred.' });
});

const server = app.listen(PORT, () => {
  console.log(`[DUKAAN API Server] Running on port ${PORT} [Instance: ${INSTANCE_ID}]`);
});

const gracefulShutdown = (signal) => {
  console.log(`[DUKAAN API] ${signal} signal received: closing HTTP server gracefully...`);
  server.close(async () => {
    try {
      const db = require('./config/db');
      if (db.pool && db.pool.end) await db.pool.end();
    } catch {}
    process.exit(0);
  });
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
