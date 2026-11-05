const express = require('express');
const app = express();

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'dukaan-api-serverless',
    timestamp: new Date().toISOString(),
  });
});

app.post('/api/auth/send-otp', (req, res) => {
  const { phone } = req.body || {};
  res.json({
    status: 'success',
    message: 'OTP dispatched successfully',
    channel: 'sms',
    recipient: phone,
  });
});

app.post('/api/notifications/welcome', (req, res) => {
  const { email, customerName } = req.body || {};
  res.json({
    status: 'success',
    message: `Welcome dispatch triggered for ${customerName || 'patron'}`,
    email,
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
    orderNumber: order?.orderNumber,
  });
});

app.all('*', (req, res) => {
  res.json({ status: 'success', endpoint: req.url });
});

module.exports = app;
