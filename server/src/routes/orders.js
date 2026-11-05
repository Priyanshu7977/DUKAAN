const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { requireAuth } = require('../middleware/auth');
const { orderLimiter } = require('../middleware/rateLimiter');
const notificationService = require('../services/notificationService');

router.post('/create', orderLimiter, async (req, res) => {
  const { customer, items, shippingAddress, paymentMethod, couponCode } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0 || !customer || !shippingAddress) {
    return res.status(400).json({ status: 'error', message: 'Incomplete or malformed order payload.' });
  }

  let client;
  try {
    client = await db.pool.connect();
    await client.query('BEGIN');

    let verifiedSubtotal = 0;
    const validatedItems = [];

    for (const item of items) {
      let price = 2500;
      let name = item.name || 'DUKAAN Garment';

      try {
        if (item.productId) {
          const prodRes = await client.query('SELECT id, name, price FROM products WHERE id = $1', [item.productId]);
          if (prodRes.rows && prodRes.rows[0]) {
            price = prodRes.rows[0].price;
            name = prodRes.rows[0].name;
          } else if (item.price && Number.isFinite(Number(item.price))) {
            price = Math.max(0, Number(item.price));
          }
        } else if (item.price && Number.isFinite(Number(item.price))) {
          price = Math.max(0, Number(item.price));
        }
      } catch {
        if (item.price && Number.isFinite(Number(item.price))) {
          price = Math.max(0, Number(item.price));
        }
      }

      const qty = Math.min(99, Math.max(1, parseInt(item.quantity, 10) || 1));
      verifiedSubtotal += price * qty;

      validatedItems.push({
        productId: item.productId || 'custom-garment',
        name,
        size: String(item.size || 'M').substring(0, 10),
        color: String(item.color || 'Standard').substring(0, 30),
        price,
        quantity: qty,
      });
    }

    let discountAmount = 0;
    const normCoupon = couponCode ? String(couponCode).toUpperCase().trim() : '';
    if (['WELCOME500', 'DUKAAN500'].includes(normCoupon)) {
      discountAmount = Math.min(verifiedSubtotal, 500);
    } else if (['DUKAAN10', 'WELCOME10', 'FIRSTBUY'].includes(normCoupon)) {
      discountAmount = Math.round(verifiedSubtotal * 0.1);
    }

    const shippingFee = verifiedSubtotal >= 1999 ? 0 : 150;
    const codHandlingFee = paymentMethod === 'cod' ? 99 : 0;
    const totalAmount = Math.max(0, verifiedSubtotal - discountAmount + shippingFee + codHandlingFee);

    const orderNumber = `DUK-IN-${Math.floor(100000 + Math.random() * 900000)}`;

    const orderInsertRes = await client.query(
      `INSERT INTO orders (
        order_number, user_id, customer_name, customer_email, customer_phone,
        shipping_address, subtotal, discount_amount, shipping_fee, total_amount, payment_method
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING id, order_number, total_amount, created_at`,
      [
        orderNumber,
        req.user?.id || null,
        String(customer.fullName || 'Patron').substring(0, 100),
        String(customer.email || 'client@dukaan.in').substring(0, 150).toLowerCase(),
        String(customer.phone || '').substring(0, 20),
        JSON.stringify(shippingAddress),
        verifiedSubtotal,
        discountAmount,
        shippingFee,
        totalAmount,
        paymentMethod === 'cod' ? 'cod' : 'prepaid',
      ]
    );

    const createdOrder = orderInsertRes.rows[0];

    for (const valItem of validatedItems) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, product_name, size, color, price, quantity)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [createdOrder.id, valItem.productId, valItem.name, valItem.size, valItem.color, valItem.price, valItem.quantity]
      );
    }

    await client.query('COMMIT');

    let notificationData = null;
    try {
      notificationData = await notificationService.dispatchOrderNotifications({
        order: {
          orderNumber: createdOrder.order_number,
          subtotal: verifiedSubtotal,
          discountAmount,
          shippingFee,
          totalAmount,
          paymentMethod,
          created_at: createdOrder.created_at,
        },
        customer,
        items: validatedItems,
        shippingAddress,
      });
    } catch (notifErr) {
      console.warn('[Notification Notice]', notifErr.message);
    }

    res.status(201).json({
      status: 'success',
      order: {
        orderId: createdOrder.order_number,
        total: createdOrder.total_amount,
        items: validatedItems,
        createdAt: createdOrder.created_at,
        notifications: notificationData,
      },
    });
  } catch (err) {
    if (client) {
      try { await client.query('ROLLBACK'); } catch {}
    }
    console.error('[Create Order Error]', err);
    res.status(500).json({ status: 'error', message: 'Failed to create order.' });
  } finally {
    if (client) client.release();
  }
});

router.get('/my-orders', requireAuth, async (req, res) => {
  try {
    const ordersRes = await db.queryWithRLS(
      req.user.id,
      req.user.role,
      `SELECT o.*, json_agg(i.*) as items 
       FROM orders o 
       LEFT JOIN order_items i ON o.id = i.order_id 
       WHERE o.user_id = $1 
       GROUP BY o.id 
       ORDER BY o.created_at DESC`,
      [req.user.id]
    );

    res.json({
      status: 'success',
      orders: ordersRes.rows,
    });
  } catch (err) {
    console.error('[Get Orders Error]', err);
    res.status(500).json({ status: 'error', message: 'Failed to retrieve orders.' });
  }
});

router.get('/track/:orderNumber', async (req, res) => {
  const rawOrderNumber = req.params.orderNumber || '';
  const orderNumber = String(rawOrderNumber).trim().toUpperCase();

  if (!orderNumber || orderNumber.length < 5) {
    return res.status(400).json({ status: 'error', message: 'Invalid or missing order reference number.' });
  }

  try {
    let orderData = null;
    let items = [];

    try {
      const dbRes = await db.pool.query(
        `SELECT o.*, json_agg(i.*) as items
         FROM orders o
         LEFT JOIN order_items i ON o.id = i.order_id
         WHERE UPPER(o.order_number) = $1
         GROUP BY o.id`,
        [orderNumber]
      );
      if (dbRes.rows && dbRes.rows.length > 0) {
        orderData = dbRes.rows[0];
        items = orderData.items || [];
      }
    } catch {}

    const isSimulated = !orderData;
    const trackingNumber = orderData?.tracking_number || `BLUEDART-${Math.floor(1000000 + Math.random() * 9000000)}`;

    res.json({
      status: 'success',
      order: {
        orderNumber,
        status: orderData?.status || 'In Transit',
        carrier: 'BlueDart Air Express',
        trackingNumber,
        estimatedDelivery: 'Within 2 – 4 working days',
        isSimulated,
        totalAmount: orderData?.total_amount || 3490,
        items: items.length > 0 ? items : [
          {
            name: 'DUKAAN Handcrafted Garment',
            size: 'M',
            color: 'Natural Cream',
            price: 3490,
            quantity: 1,
          },
        ],
      },
    });
  } catch (err) {
    console.error('[Track Order Error]', err);
    res.status(500).json({ status: 'error', message: 'Failed to query order tracking.' });
  }
});

module.exports = router;
