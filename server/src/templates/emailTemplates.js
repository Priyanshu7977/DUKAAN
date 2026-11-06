function buildOrderConfirmationEmailHtml({ order, customer, items, shippingAddress }) {
  const itemsList = (items || []).map((it) => `
    <tr>
      <td style="padding: 14px 0; border-bottom: 1px solid #ECE7DD; font-size: 14px; color: #141414;">
        <strong>${it.name || 'Garment'}</strong><br>
        <span style="font-size: 11px; color: #73706B; text-transform: uppercase;">Shade: ${it.color || 'Standard'} • Size: ${it.size || 'M'}</span>
      </td>
      <td style="padding: 14px 0; border-bottom: 1px solid #ECE7DD; text-align: center; font-size: 13px; color: #141414;">
        ${it.quantity || 1}
      </td>
      <td style="padding: 14px 0; border-bottom: 1px solid #ECE7DD; text-align: right; font-size: 14px; font-weight: 600; color: #141414;">
        ₹${((it.price || 0) * (it.quantity || 1)).toLocaleString('en-IN')}
      </td>
    </tr>
  `).join('');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmation #${order.orderNumber || ''}</title>
</head>
<body style="margin: 0; padding: 24px; background-color: #FAF9F6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #141414;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border: 1px solid #EAE5DF; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.03);">
    <!-- Brand Banner -->
    <tr>
      <td style="padding: 32px 32px 24px 32px; text-align: center; border-bottom: 2px solid #141414; background-color: #141414;">
        <h1 style="margin: 0; font-family: 'Times New Roman', serif; font-size: 28px; letter-spacing: 0.3em; text-transform: uppercase; color: #FFFFFF; font-weight: 400;">DUKAAN</h1>
        <p style="margin: 6px 0 0 0; font-size: 10px; text-transform: uppercase; letter-spacing: 0.25em; color: #EAE7DF;">Dispatch Notice</p>
      </td>
    </tr>

    <!-- Body Content -->
    <tr>
      <td style="padding: 32px;">
        <span style="display: inline-block; font-size: 10px; text-transform: uppercase; letter-spacing: 0.2em; color: #A7654A; font-weight: 600; margin-bottom: 8px;">Order Confirmed • #${order.orderNumber}</span>
        <h2 style="margin: 0 0 16px 0; font-family: 'Times New Roman', serif; font-size: 24px; color: #141414; font-weight: normal;">Your pieces are being prepared, ${customer.fullName || 'Patron'}.</h2>

        <p style="font-size: 13px; line-height: 1.7; color: #55524E; margin: 0 0 24px 0;">
          We have received your order and our tailors have begun hand-checking, pressing, and packaging your garments in natural protective kraft dust bags at our Mumbai Studio.
        </p>

        <!-- Good Note Box -->
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #FAF8F5; border-left: 3px solid #A7654A; border-radius: 6px; padding: 16px 20px; margin-bottom: 24px;">
          <tr>
            <td>
              <h4 style="margin: 0 0 6px 0; font-family: 'Times New Roman', serif; font-size: 15px; color: #141414;">Care Good Note</h4>
              <p style="margin: 0; font-size: 12px; line-height: 1.6; color: #73706B;">
                "Natural fibres breathe with your body. We recommend gentle cold washing and flat drying in natural shade to preserve the architectural drape of your linen and cotton pieces."
              </p>
            </td>
          </tr>
        </table>

        <!-- Order Items -->
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px; border-collapse: collapse;">
          <thead>
            <tr style="border-bottom: 1.5px solid #141414; font-size: 10px; text-transform: uppercase; letter-spacing: 0.15em; color: #73706B;">
              <th align="left" style="padding-bottom: 8px;">Piece</th>
              <th align="center" style="padding-bottom: 8px;">Qty</th>
              <th align="right" style="padding-bottom: 8px;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsList}
          </tbody>
        </table>

        <!-- Totals Breakdown -->
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 28px; font-size: 13px;">
          <tr>
            <td style="padding: 4px 0; color: #73706B;">Subtotal:</td>
            <td align="right" style="padding: 4px 0; color: #141414;">₹${(order.subtotal || 0).toLocaleString('en-IN')}</td>
          </tr>
          ${(order.discountAmount || 0) > 0 ? `
          <tr>
            <td style="padding: 4px 0; color: #0F6B38; font-weight: 600;">VIP Discount Privilege:</td>
            <td align="right" style="padding: 4px 0; color: #0F6B38; font-weight: 600;">-₹${(order.discountAmount).toLocaleString('en-IN')}</td>
          </tr>` : ''}
          <tr>
            <td style="padding: 4px 0; color: #73706B;">Express Courier Delivery:</td>
            <td align="right" style="padding: 4px 0; color: #141414;">${(order.shippingFee || 0) === 0 ? 'FREE' : `₹${order.shippingFee}`}</td>
          </tr>
          <tr style="border-top: 2px solid #141414;">
            <td style="padding: 12px 0 0 0; font-size: 16px; font-weight: bold; color: #141414;">Total Settled (GST Incl.):</td>
            <td align="right" style="padding: 12px 0 0 0; font-size: 16px; font-weight: bold; color: #141414;">₹${(order.totalAmount || 0).toLocaleString('en-IN')}</td>
          </tr>
        </table>

        <!-- CTA Buttons -->
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td align="center" style="padding-bottom: 12px;">
              <a href="https://wa.me/917977641125?text=${encodeURIComponent(`Hi DUKAAN Concierge, I would like tracking updates for my order #${order.orderNumber}.`)}" 
                 style="display: block; width: 100%; box-sizing: border-box; background-color: #141414; color: #FFFFFF; text-align: center; padding: 14px 24px; border-radius: 8px; text-decoration: none; font-size: 11px; text-transform: uppercase; letter-spacing: 0.2em; font-weight: 600;">
                Connect On WhatsApp For Live Updates →
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="padding: 24px 32px; background-color: #FAF8F5; border-top: 1px solid #ECE7DD; text-align: center; font-size: 11px; color: #73706B; line-height: 1.6;">
        <strong style="color: #141414;">DUKAAN Concierge & Client Care</strong><br>
        Direct Hotline / WhatsApp: +91 7977641125 • Email: priyanshubipin2006@gmail.com<br>
        Mumbai Design Studio • Nationwide Express Delivery Across 19,000+ PIN Codes
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

function buildWelcomeEmailHtml({ customerName = 'Patron', promoCode = 'WELCOME500' }) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Welcome to DUKAAN</title>
</head>
<body style="margin: 0; padding: 24px; background-color: #FAF9F6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #141414;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 580px; margin: 0 auto; background-color: #FFFFFF; border: 1px solid #EAE5DF; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.03);">
    <tr>
      <td style="padding: 36px 32px; text-align: center; background-color: #141414; color: #FFFFFF;">
        <h1 style="margin: 0; font-family: 'Times New Roman', serif; font-size: 30px; letter-spacing: 0.3em; text-transform: uppercase; font-weight: normal;">DUKAAN</h1>
        <p style="margin: 6px 0 0 0; font-size: 10px; text-transform: uppercase; letter-spacing: 0.25em; color: #EAE7DF;">Objects of Everyday Expression</p>
      </td>
    </tr>
    <tr>
      <td style="padding: 36px 32px;">
        <span style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.2em; color: #A7654A; font-weight: 600;">Welcome to DUKAAN</span>
        <h2 style="margin: 8px 0 16px 0; font-family: 'Times New Roman', serif; font-size: 26px; font-weight: normal;">Greetings, ${customerName}.</h2>

        <p style="font-size: 13px; line-height: 1.7; color: #55524E; margin: 0 0 20px 0;">
          We are honored to welcome you. At DUKAAN, we discard fast-fashion synthetics and disposable trends. Every silhouette in our wardrobe is built with pure European flax linen, breathable double-gauze cotton, and relaxed dropped geometries.
        </p>

        <!-- VIP Privilege Box -->
        <div style="background-color: #FAF8F5; border: 1px dashed #A7654A; border-radius: 8px; padding: 20px; text-align: center; margin: 24px 0;">
          <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.15em; color: #73706B; font-weight: 600;">Your Exclusive Welcome Gift</span>
          <div style="font-family: monospace; font-size: 26px; font-weight: bold; letter-spacing: 0.15em; color: #141414; margin: 8px 0;">${promoCode}</div>
          <p style="margin: 0; font-size: 11px; color: #A7654A; font-weight: 500;">Enjoy ₹500 off on your order at checkout.</p>
        </div>

        <div style="text-align: center; margin-top: 28px;">
          <a href="https://dukaan.app/shop" style="display: inline-block; background-color: #141414; color: #FFFFFF; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-size: 11px; text-transform: uppercase; letter-spacing: 0.2em; font-weight: 600;">
            Explore The Wardrobe Catalog →
          </a>
        </div>
      </td>
    </tr>
    <tr>
      <td style="padding: 20px; background-color: #FAF8F5; border-top: 1px solid #ECE7DD; text-align: center; font-size: 11px; color: #73706B;">
        Concierge Hotline: +91 7977641125 • priyanshubipin2006@gmail.com
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

function buildContactAcknowledgmentHtml({ customerName, ticketId, subject }) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>DUKAAN Concierge Ticket #${ticketId}</title>
</head>
<body style="margin: 0; padding: 24px; background-color: #FAF9F6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #141414;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 580px; margin: 0 auto; background-color: #FFFFFF; border: 1px solid #EAE5DF; border-radius: 12px; overflow: hidden;">
    <tr>
      <td style="padding: 28px 32px; text-align: center; background-color: #141414; color: #FFFFFF;">
        <h1 style="margin: 0; font-family: 'Times New Roman', serif; font-size: 26px; letter-spacing: 0.3em; text-transform: uppercase; font-weight: normal;">DUKAAN</h1>
        <p style="margin: 4px 0 0 0; font-size: 10px; text-transform: uppercase; letter-spacing: 0.25em; color: #EAE7DF;">Client Care Concierge</p>
      </td>
    </tr>
    <tr>
      <td style="padding: 32px;">
        <span style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.2em; color: #A7654A; font-weight: 600;">Ticket Coordinate: #${ticketId}</span>
        <h2 style="margin: 8px 0 16px 0; font-family: 'Times New Roman', serif; font-size: 22px; font-weight: normal;">Inquiry Received, ${customerName}.</h2>

        <p style="font-size: 13px; line-height: 1.7; color: #55524E; margin: 0 0 16px 0;">
          Thank you for reaching out regarding <strong>"${subject || 'Client Assistance'}"</strong>. Your request has been assigned to our primary customer team.
        </p>

        <p style="font-size: 13px; line-height: 1.7; color: #55524E; margin: 0 0 24px 0;">
          Our response SLA is within 2 to 4 business hours. If you need immediate assistance with an ongoing courier delivery or doorstep exchange, you may contact our concierge directly via WhatsApp:
        </p>

        <div style="text-align: center;">
          <a href="https://wa.me/917977641125?text=${encodeURIComponent(`Hi Concierge, I am following up on inquiry ticket #${ticketId}.`)}" 
             style="display: inline-block; background-color: #0F6B38; color: #FFFFFF; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-size: 11px; text-transform: uppercase; letter-spacing: 0.15em; font-weight: 600;">
            Chat On WhatsApp (+91 7977641125) →
          </a>
        </div>
      </td>
    </tr>
    <tr>
      <td style="padding: 20px; background-color: #FAF8F5; border-top: 1px solid #ECE7DD; text-align: center; font-size: 11px; color: #73706B;">
        DUKAAN Client Care • Mumbai Studio
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

module.exports = {
  buildOrderConfirmationEmailHtml,
  buildWelcomeEmailHtml,
  buildContactAcknowledgmentHtml,
};
