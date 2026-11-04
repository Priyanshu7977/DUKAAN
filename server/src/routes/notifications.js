const express = require('express');
const router = express.Router();
const notificationService = require('../services/notificationService');
const db = require('../config/db');

// In-memory cache for recent Good Notes for instant retrieval
const goodNotesCache = new Map();

// 1. Dispatch Order Notifications & Generate Atelier Good Note
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
      goodNotesCache.set(result.orderNumber, result.goodNoteHtml);
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

// 2. View/Download Atelier Good Note by Order Number (Printable Web Dossier)
router.get('/good-note/:orderNumber', async (req, res) => {
  const { orderNumber } = req.params;

  // 1. Check in-memory cache
  if (goodNotesCache.has(orderNumber)) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.send(goodNotesCache.get(orderNumber));
  }

  // 2. Try looking up in PostgreSQL database if available
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

      goodNotesCache.set(orderNumber, html);
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      return res.send(html);
    }
  } catch (e) {
    // ignore db error, proceed to fallback
  }

  // Fallback demo Good Note
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

// 3. Welcome Note Dispatch (Newsletter / New Account)
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

// 4. Contact Inquiry Auto-Acknowledgment
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
