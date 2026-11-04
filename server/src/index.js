const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const orderRoutes = require('./routes/orders');
const notificationRoutes = require('./routes/notifications');
const { generalLimiter } = require('./middleware/rateLimiter');

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
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Blocked by CORS security policy.'));
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
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/notifications', notificationRoutes);

app.use((req, res) => {
  res.status(404).json({ status: 'error', message: 'API endpoint not found.' });
});

app.use((err, req, res, next) => {
  console.error('[Unhandled Server Exception]:', err.message);
  res.status(500).json({ status: 'error', message: 'Internal server error occurred.' });
});

app.listen(PORT, () => {
  console.log(`[DUKAAN API Server] Running on port ${PORT} [Instance: ${INSTANCE_ID}]`);
});
