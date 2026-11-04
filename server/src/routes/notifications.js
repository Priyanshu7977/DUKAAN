const express = require('express');
const router = express.Router();
const notificationService = require('../services/notificationService');
const db = require('../config/db');

const MAX_CACHE_SIZE = 500;
const goodNotesCache = new Map();

function cacheGoodNote(key, html) {
  if (goodNotesCache.size >= MAX_CACHE_SIZE) {
    const oldestKey = goodNotesCache.keys().next().value;
    goodNotesCache.delete(oldestKey);
  }
  goodNotesCache.set(key, html);
}

router.post('/order-dispatch', async (req, res) => {
  try {
    const { order, customer, items, shippingAddress } = req.body;
    if (!customer || !customer.email) {
      return res.status(400).json({ status: 'error', message: 'Customer information required.' });
    }

    const result = await notificationService.dispatchOrderNotifications({
      order: order || {},
      customer,
      items: items || [],
      shippingAddress: shippingAddress || {},
    });

    if (result.orderNumber && result.goodNoteHtml) {
      cacheGoodNote(result.orderNumber, result.goodNoteHtml);
    }

    res.json({
      status: 'success',
      message: 'Automated notifications dispatched across Email, WhatsApp, and Atelier Registry.',
      data: result,
    });
  } catch (err) {
    console.error('Error dispatching notifications:', err);
    res.status(500).json({ status: 'error', message: 'Failed to process notifications.' });
  }
});

router.get('/good-note/:orderNumber', async (req, res) => {
  const { orderNumber } = req.params;

  if (goodNotesCache.has(orderNumber)) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.send(goodNotesCache.get(orderNumber));
  }

  try {
    const orderRes = await db.query(
      'SELECT * FROM orders WHERE order_number = $1 LIMIT 1',
      [orderNumber]
    );

    if (orderRes.rows.length > 0) {
      const order = orderRes.rows[0];
      const itemsRes = await db.query(
        'SELECT * FROM order_items WHERE order_id = $1',
        [order.id]
      );

      const { buildAtelierGoodNoteHtml } = require('../templates/goodNoteTemplate');
      const html = buildAtelierGoodNoteHtml({
        orderNumber: order.order_number,
        customerName: order.customer_name,
        customerEmail: order.customer_email,
        customerPhone: order.customer_phone,
        shippingAddress: order.shipping_address,
        items: itemsRes.rows,
        subtotal: order.subtotal,
        discountAmount: order.discount_amount,
        shippingFee: order.shipping_fee,
        totalAmount: order.total_amount,
        paymentMethod: order.payment_method,
        createdAt: order.created_at,
      });

      cacheGoodNote(orderNumber, html);
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      return res.send(html);
    }
  } catch (e) {
  }

  const { buildAtelierGoodNoteHtml } = require('../templates/goodNoteTemplate');
  const fallbackHtml = buildAtelierGoodNoteHtml({
    orderNumber,
    customerName: 'DUKAAN Patron',
    totalAmount: 4100,
    items: [{ name: 'Normandy Linen Shirt', size: 'M', color: 'Natural Flax', price: 4100, quantity: 1 }],
  });
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(fallbackHtml);
});

router.post('/welcome', async (req, res) => {
  try {
    const { email, customerName, promoCode } = req.body;
    if (!email) {
      return res.status(400).json({ status: 'error', message: 'Email address required.' });
    }

    const result = await notificationService.dispatchWelcomeNotification({
      email,
      customerName: customerName || 'Patron',
      promoCode: promoCode || 'WELCOME500',
    });

    res.json(result);
  } catch (err) {
    console.error('Welcome dispatch error:', err);
    res.status(500).json({ status: 'error', message: 'Failed to dispatch welcome note.' });
  }
});

router.post('/inquiry-acknowledgment', async (req, res) => {
  try {
    const { name, email, phone, subject } = req.body;
    if (!email || !name) {
      return res.status(400).json({ status: 'error', message: 'Name and email are required.' });
    }

    const result = await notificationService.dispatchInquiryAcknowledgment({
      name,
      email,
      phone,
      subject,
    });

    res.json(result);
  } catch (err) {
    console.error('Inquiry acknowledgment error:', err);
    res.status(500).json({ status: 'error', message: 'Failed to process inquiry.' });
  }
});

module.exports = router;
