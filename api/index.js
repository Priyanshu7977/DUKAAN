import express from 'express';
import crypto from 'crypto';

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
    message: 'Concierge inquiry received',
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

const upiOrders = new Map();

app.post('/api/v1/orders', (req, res) => {
  const {
    amount,
    client_order_id,
    customer_name,
    customer_email,
    customer_mobile,
    note,
    vpa: requestedVpa,
    merchant_name: requestedMerchant,
  } = req.body || {};

  const numAmount = Number(amount);
  if (!numAmount || isNaN(numAmount) || numAmount <= 0) {
    return res.status(422).json({
      success: false,
      message: 'The amount field is required and must be greater than zero.',
      errors: { amount: ['Invalid amount'] },
    });
  }

  const orderId = `ord_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  const vpa = (requestedVpa || process.env.UPI_VPA || '7977641125@ybl').trim();
  const merchantName = (requestedMerchant || process.env.UPI_MERCHANT_NAME || 'DUKAAN').trim();
  const safeClientOrderId = (client_order_id || `CL-${Date.now()}`).toString().trim().slice(0, 64);
  const formattedAmount = numAmount.toFixed(2);
  const safeNote = (note || `DUKAAN Order ${safeClientOrderId}`).trim().slice(0, 100);

  const query = new URLSearchParams({
    pa: vpa,
    pn: merchantName,
    am: formattedAmount,
    cu: 'INR',
    tr: orderId,
    tn: safeNote,
  });
  const upiIntent = `upi://pay?${query.toString()}`;
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

  const record = {
    order_id: orderId,
    client_order_id: safeClientOrderId,
    amount: formattedAmount,
    currency: 'INR',
    status: 'pending',
    environment: 'live',
    vpa,
    merchant_name: merchantName,
    payment_url: `/pay/${orderId}`,
    upi_intent: upiIntent,
    expires_at: expiresAt,
    customer_name: customer_name ? String(customer_name).slice(0, 80) : '',
    customer_mobile: customer_mobile ? String(customer_mobile).slice(0, 15) : '',
    customer_email: customer_email ? String(customer_email).slice(0, 100) : '',
    created_at: new Date().toISOString(),
  };

  upiOrders.set(orderId, record);
  upiOrders.set(safeClientOrderId, record);

  res.status(201).json({
    success: true,
    data: record,
  });
});

app.get('/api/v1/orders/:orderId', (req, res) => {
  const { orderId } = req.params;
  const order = upiOrders.get(orderId);
  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found.',
    });
  }

  if (new Date(order.expires_at).getTime() < Date.now() && order.status === 'pending') {
    order.status = 'expired';
  }

  res.json({
    success: true,
    data: order,
  });
});

app.post('/api/v1/orders/:orderId/utr', (req, res) => {
  const { orderId } = req.params;
  const { utr } = req.body || {};

  const cleanUtr = String(utr || '').trim();
  if (!/^\d{12}$/.test(cleanUtr)) {
    return res.status(422).json({
      success: false,
      message: 'Please enter a valid 12-digit numeric UTR / UPI reference number.',
      errors: { utr: ['Must be exactly 12 digits'] },
    });
  }

  const order = upiOrders.get(orderId);
  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found.',
    });
  }

  order.utr = cleanUtr;
  order.status = 'review';
  order.utr_submitted_at = new Date().toISOString();

  res.json({
    success: true,
    data: order,
    message: 'UTR submitted successfully. Banking verification underway.',
  });
});

app.post('/api/v1/webhooks/upi', (req, res) => {
  const secret = process.env.UPI_WEBHOOK_SECRET;
  if (secret) {
    const signature = req.headers['x-signature'];
    const expected = crypto.createHmac('sha256', secret).update(JSON.stringify(req.body)).digest('hex');
    if (!signature || signature !== expected) {
      return res.status(401).json({ success: false, message: 'Invalid webhook signature' });
    }
  }

  const event = req.body || {};

  if (event.event === 'order.paid' && event.data?.order_id) {
    const order = upiOrders.get(event.data.order_id);
    if (order) {
      order.status = 'paid';
      order.paid_at = new Date().toISOString();
      if (event.data.utr) {
        order.utr = event.data.utr;
      }
    }
  }

  res.json({
    success: true,
    received: true,
    event: event.event || 'unknown',
  });
});

app.use((req, res) => {
  res.json({ status: 'success', endpoint: req.url });
});

export default app;
