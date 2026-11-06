const { buildOrderConfirmationEmailHtml, buildWelcomeEmailHtml, buildContactAcknowledgmentHtml } = require('../templates/emailTemplates');
const { buildGoodNoteHtml } = require('../templates/goodNoteTemplate');

class NotificationService {
  async dispatchOrderNotifications({ order, customer, items, shippingAddress }) {
    const timestamp = new Date().toISOString();
    const orderNumber = order.order_number || order.orderNumber || `DUK-IN-${Math.floor(100000 + Math.random() * 900000)}`;

    const normalizedOrder = {
      orderNumber,
      customerName: customer.fullName || customer.name || 'Valued Patron',
      customerEmail: customer.email,
      customerPhone: customer.phone,
      shippingAddress: shippingAddress || {},
      items: items || [],
      subtotal: order.subtotal || 0,
      discountAmount: order.discount_amount || order.discountAmount || 0,
      shippingFee: order.shipping_fee || order.shippingFee || 0,
      totalAmount: order.total_amount || order.totalAmount || 0,
      paymentMethod: order.payment_method || order.paymentMethod || 'prepaid',
      createdAt: order.created_at || timestamp,
    };

    const emailHtml = buildOrderConfirmationEmailHtml({
      order: normalizedOrder,
      customer,
      items: normalizedOrder.items,
      shippingAddress: normalizedOrder.shippingAddress,
    });

    const itemsSummary = normalizedOrder.items.map((it) => `• ${it.name} (${it.size}) × ${it.quantity || 1}`).join('\n');
    const whatsAppMessage = 
`✨ *DUKAAN — Order Confirmed* ✨
Dear ${normalizedOrder.customerName}, your order *#${orderNumber}* has been received and scheduled for hand-crafted preparation in Mumbai.

📦 *Garments in Dispatch:*
${itemsSummary}

💳 *Total Settled:* ₹${normalizedOrder.totalAmount.toLocaleString('en-IN')} (${normalizedOrder.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Prepaid'})
🚚 *Courier Partner:* BlueDart / Delhivery Express
⏱️ *Estimated Delivery:* 2 – 3 Business Days

🌿 *DUKAAN Care Good Note:*
Each piece is 100% natural Normandy flax or organic gauze cotton. Free 7-day doorstep size exchange is included.

Need styling or tracking assistance? Reply directly to this WhatsApp chat or call concierge at +91 7977641125.`;

    const whatsAppUrl = `https://wa.me/917977641125?text=${encodeURIComponent(whatsAppMessage)}`;

    const goodNoteHtml = buildGoodNoteHtml(normalizedOrder);

    const emailResult = await this.sendEmail({
      to: customer.email,
      subject: `Order Confirmed #${orderNumber} — DUKAAN`,
      html: emailHtml,
    });

    console.log(`[NotificationAutomation] Order ${orderNumber} dispatched to ${customer.email} & WhatsApp link prepared.`);

    return {
      status: 'success',
      orderNumber,
      dispatchedAt: timestamp,
      channels: {
        email: {
          recipient: customer.email,
          status: emailResult.status,
          messageId: emailResult.messageId,
        },
        whatsapp: {
          recipient: customer.phone,
          status: 'ready',
          deepLink: whatsAppUrl,
          messagePreview: whatsAppMessage,
        },
        goodNote: {
          status: 'generated',
          viewUrl: `/api/notifications/good-note/${orderNumber}`,
        },
      },
      goodNoteHtml,
    };
  }

  async dispatchWelcomeNotification({ email, customerName, promoCode = 'WELCOME500' }) {
    const emailHtml = buildWelcomeEmailHtml({ customerName, promoCode });
    const result = await this.sendEmail({
      to: email,
      subject: `Welcome to DUKAAN — Your VIP ₹500 Privilege Gift`,
      html: emailHtml,
    });

    console.log(`[NotificationAutomation] Welcome email sent to ${email} with promo ${promoCode}`);
    return { status: 'success', recipient: email, promoCode };
  }

  async dispatchInquiryAcknowledgment({ name, email, phone, subject }) {
    const ticketId = `TKT-${Math.floor(10000 + Math.random() * 90000)}`;
    const emailHtml = buildContactAcknowledgmentHtml({ customerName: name, ticketId, subject });

    await this.sendEmail({
      to: email,
      subject: `Concierge Ticket #${ticketId} — DUKAAN Inquiry Received`,
      html: emailHtml,
    });

    const whatsAppFollowupUrl = `https://wa.me/917977641125?text=${encodeURIComponent(`Hi Concierge, following up on ticket #${ticketId} regarding "${subject}".`)}`;

    console.log(`[NotificationAutomation] Ticket #${ticketId} logged and acknowledgment dispatched to ${email}`);

    return {
      status: 'success',
      ticketId,
      email,
      whatsAppFollowupUrl,
    };
  }

  async sendEmail({ to, subject, html }) {
    if (process.env.SMTP_HOST && process.env.SMTP_USER) {
      try {
        const nodemailer = require('nodemailer');
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: parseInt(process.env.SMTP_PORT || '587', 10),
          secure: process.env.SMTP_SECURE === 'true',
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });

        const info = await transporter.sendMail({
          from: `"DUKAAN" <${process.env.SMTP_FROM || 'concierge@dukaan.app'}>`,
          to,
          subject,
          html,
        });

        return { status: 'sent', messageId: info.messageId };
      } catch (err) {
        console.warn('[NotificationAutomation] SMTP error, falling back to simulated mailer:', err.message);
      }
    }

    return {
      status: 'simulated_success',
      messageId: `msg_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      recipient: to,
      subject,
    };
  }
}

module.exports = new NotificationService();
