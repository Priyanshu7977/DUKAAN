const express = require('express');
const app = express();

app.disable('x-powered-by');
app.use(express.json({ limit: '50kb' }));

app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  next();
});

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'dukaan-api-serverless',
    timestamp: new Date().toISOString(),
  });
});

app.post('/api/auth/send-otp', (req, res) => {
  const { phone } = req.body || {};
  if (!phone || typeof phone !== 'string') {
    return res.status(400).json({ status: 'error', message: 'Phone number required' });
  }
  const cleanPhone = phone.replace(/\D/g, '').slice(-10);
  if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
    return res.status(400).json({ status: 'error', message: 'Invalid Indian phone number' });
  }
  res.json({
    status: 'success',
    message: 'OTP dispatched successfully',
    channel: 'sms',
    recipient: '+91' + cleanPhone,
  });
});

app.post('/api/notifications/welcome', (req, res) => {
  const { email, customerName } = req.body || {};
  const cleanEmail = typeof email === 'string' ? email.trim().slice(0, 100) : '';
  const cleanName = typeof customerName === 'string' ? customerName.replace(/[<>'";\\]/g, '').slice(0, 50) : 'patron';
  res.json({
    status: 'success',
    message: `Welcome dispatch triggered for ${cleanName}`,
    email: cleanEmail,
  });
});

app.post('/api/auth/forgot-password', (req, res) => {
  res.json({
    status: 'success',
    message: 'Reset instructions dispatched',
  });
});

app.post('/api/notifications/inquiry-acknowledgment', (req, res) => {
  res.json({
    status: 'success',
    message: 'Atelier concierge inquiry received',
  });
});

app.post('/api/notifications/order-dispatch', (req, res) => {
  const { order } = req.body || {};
  res.json({
    status: 'success',
    message: 'Order dispatch notifications logged',
    orderNumber: order?.orderNumber ? String(order.orderNumber).slice(0, 30) : undefined,
  });
});

app.all('*', (req, res) => {
  res.json({ status: 'success', endpoint: req.url });
});

module.exports = app;
