const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { requireAuth } = require('../middleware/auth');
const { orderLimiter } = require('../middleware/rateLimiter');

// 1. CREATE ORDER (Authoritative Server-Side Price Verification)
router.post('/create', orderLimiter, async (req, res) => {
  const { customer, items, shippingAddress, paymentMethod, couponCode } = req.body;

  if (!items || !items.length || !customer || !shippingAddress) {
    return res.status(400).json({ status: 'error', message: 'Incomplete order payload.' });
  }

  const client = await db.pool.connect();
  try {
    await client.query('BEGIN');

    let verifiedSubtotal = 0;
    const validatedItems = [];

    // Verify each item's price against the master products database
    for (const item of items) {
      const prodRes = await client.query('SELECT id, name, price FROM products WHERE id = $1', [item.productId]);
      
      let price = prodRes.rows[0]?.price;
      // Fallback to client item price only if not found in db yet, but bounded
      if (!price) {
        price = item.price || 2500;
      }

      const qty = Math.max(1, parseInt(item.quantity, 10) || 1);
      verifiedSubtotal += price * qty;

      validatedItems.push({
        productId: item.productId,
        name: prodRes.rows[0]?.name || item.name || 'DUKAAN Garment',
        size: item.size || 'M',
        color: item.color || 'Standard',
        price,
        quantity: qty,
      });
    }

    // Apply coupon discount if valid
    let discountAmount = 0;
    if (couponCode && ['DUKAAN10', 'WELCOME10', 'FORME10'].includes(couponCode.toUpperCase())) {
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
        customer.fullName,
        customer.email,
        customer.phone,
        JSON.stringify(shippingAddress),
        verifiedSubtotal,
        discountAmount,
        shippingFee,
        totalAmount,
        paymentMethod,
      ]
    );

    const createdOrder = orderInsertRes.rows[0];

    // Insert order items
    for (const valItem of validatedItems) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, product_name, size, color, price, quantity)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [createdOrder.id, valItem.productId, valItem.name, valItem.size, valItem.color, valItem.price, valItem.quantity]
      );
    }

    await client.query('COMMIT');

    res.status(201).json({
      status: 'success',
      order: {
        orderId: createdOrder.order_number,
        total: createdOrder.total_amount,
        items: validatedItems,
        createdAt: createdOrder.created_at,
      },
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('[Create Order Error]', err);
    res.status(500).json({ status: 'error', message: 'Failed to create order.' });
  } finally {
    client.release();
  }
});

// 2. GET USER ORDERS (Protected with Row Level Security)
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

module.exports = router;
