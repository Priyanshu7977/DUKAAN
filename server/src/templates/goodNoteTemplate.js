function buildGoodNoteHtml(order) {
  const {
    orderNumber = 'DUK-IN-000000',
    customerName = 'Valued Patron',
    customerEmail = '',
    customerPhone = '',
    shippingAddress = {},
    items = [],
    subtotal = 0,
    discountAmount = 0,
    shippingFee = 0,
    totalAmount = 0,
    paymentMethod = 'prepaid',
    createdAt = new Date().toISOString(),
  } = order;

  const dateStr = new Date(createdAt).toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const parsedAddress = typeof shippingAddress === 'string'
    ? JSON.parse(shippingAddress)
    : shippingAddress;

  const itemsHtml = items.map((it, idx) => `
    <tr style="border-bottom: 1px solid #ECE7DD;">
      <td style="padding: 16px 8px; font-family: 'Times New Roman', serif; font-size: 15px; color: #141414;">
        <span style="display: block; font-weight: 600; letter-spacing: 0.02em;">${it.name || 'Artisanal Piece'}</span>
        <span style="display: block; font-size: 11px; text-transform: uppercase; color: #A7654A; letter-spacing: 0.15em; margin-top: 4px;">
          Shade: ${it.color || 'Standard'} • Size: ${it.size || 'M'}
        </span>
      </td>
      <td style="padding: 16px 8px; text-align: center; font-size: 13px; color: #141414; font-variant-numeric: tabular-nums;">
        ${it.quantity || 1}
      </td>
      <td style="padding: 16px 8px; text-align: right; font-size: 14px; font-weight: 600; color: #141414; font-variant-numeric: tabular-nums;">
        ₹${((it.price || 0) * (it.quantity || 1)).toLocaleString('en-IN')}
      </td>
    </tr>
  `).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>DUKAAN — Archival Good Note & Packing Dossier #${orderNumber}</title>
  <style>
    @page { size: A4; margin: 20mm; }
    body {
      margin: 0;
      padding: 32px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background-color: #FAF9F6;
      color: #141414;
      line-height: 1.6;
    }
    .sheet {
      max-width: 760px;
      margin: 0 auto;
      background: #FFFFFF;
      border: 1px solid #E5E0D8;
      border-radius: 12px;
      padding: 48px;
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.04);
      position: relative;
    }
    .watermark {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) rotate(-25deg);
      font-family: 'Times New Roman', serif;
      font-size: 110px;
      letter-spacing: 0.25em;
      color: rgba(20, 20, 20, 0.02);
      pointer-events: none;
      user-select: none;
    }
    .header {
      border-bottom: 2px solid #141414;
      padding-bottom: 24px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }
    .logo {
      font-family: 'Times New Roman', serif;
      font-size: 32px;
      letter-spacing: 0.25em;
      text-transform: uppercase;
      font-weight: 500;
      margin: 0;
      color: #141414;
    }
    .tagline {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.25em;
      color: #A7654A;
      margin-top: 4px;
      font-weight: 600;
    }
    .note-box {
      background-color: #FAF8F5;
      border: 1px solid #ECE7DD;
      border-left: 3px solid #A7654A;
      padding: 20px 24px;
      margin: 28px 0;
      border-radius: 6px;
    }
    .note-heading {
      font-family: 'Times New Roman', serif;
      font-size: 16px;
      margin: 0 0 8px 0;
      color: #141414;
    }
    .note-text {
      font-size: 12px;
      color: #55524E;
      margin: 0;
      line-height: 1.7;
    }
    .signature-area {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-top: 36px;
      padding-top: 24px;
      border-top: 1px solid #ECE7DD;
    }
    .sign-title {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.15em;
      color: #73706B;
    }
    .sign-name {
      font-family: 'Times New Roman', serif;
      font-size: 16px;
      color: #141414;
      font-weight: 600;
      margin-top: 4px;
    }
    .btn-print {
      display: inline-block;
      margin: 24px auto 0 auto;
      background: #141414;
      color: #FFFFFF;
      padding: 12px 28px;
      text-transform: uppercase;
      letter-spacing: 0.2em;
      font-size: 11px;
      font-weight: 600;
      text-decoration: none;
      border-radius: 6px;
      cursor: pointer;
      border: none;
    }
    @media print {
      body { background: white; padding: 0; }
      .sheet { box-shadow: none; border: none; padding: 0; }
      .btn-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="sheet">
    <div class="watermark">DUKAAN</div>

    <div class="header">
      <div>
        <h1 class="logo">DUKAAN</h1>
        <div class="tagline">Objects of Everyday Expression • DUKAAN Registry</div>
      </div>
      <div style="text-align: right;">
        <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.15em; color: #73706B;">Order Coordinate</div>
        <div style="font-family: monospace; font-size: 16px; font-weight: bold; color: #141414; margin-top: 2px;">#${orderNumber}</div>
        <div style="font-size: 11px; color: #73706B; margin-top: 2px;">${dateStr}</div>
      </div>
    </div>

    <!-- Personal Care Good Note -->
    <div class="note-box">
      <h3 class="note-heading">A Personal Note From The DUKAAN Desk</h3>
      <p class="note-text">
        Dear <strong>${customerName}</strong>,<br><br>
        Thank you for welcoming DUKAAN into your wardrobe. Each piece in this dispatch has been individually inspected, hand-steamed, and wrapped in natural kraft paper by our tailors in Mumbai.
        <br><br>
        We work strictly with pure Normandy flax linen, airy double-gauze cotton, and raw textural weaves. As you wear these garments, the natural plant fibres will soften and mold to your movement, developing unique personal character with every gentle wash.
        <br><br>
        If the silhouette requires a size adjustment, our complimentary 7-day doorstep exchange is at your complete disposal.
      </p>
    </div>

    <!-- Dispatch & Shipping Coordinates -->
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 28px; font-size: 12px;">
      <div style="background: #FAF9F6; padding: 16px; border-radius: 6px; border: 1px solid #ECE7DD;">
        <div style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.15em; color: #A7654A; font-weight: 600; margin-bottom: 6px;">Consignee & Destination</div>
        <div style="font-weight: 600; color: #141414;">${customerName}</div>
        <div style="color: #55524E; margin-top: 2px;">${parsedAddress.address || 'Doorstep Delivery'}</div>
        ${parsedAddress.area ? `<div style="color: #55524E;">${parsedAddress.area}</div>` : ''}
        <div style="color: #55524E;">${parsedAddress.city || 'Mumbai'}, ${parsedAddress.state || 'Maharashtra'} — <span style="font-family: monospace; font-weight: bold;">${parsedAddress.pincode || ''}</span></div>
        <div style="color: #73706B; margin-top: 4px;">Phone: ${customerPhone} • Email: ${customerEmail}</div>
      </div>

      <div style="background: #FAF9F6; padding: 16px; border-radius: 6px; border: 1px solid #ECE7DD;">
        <div style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.15em; color: #A7654A; font-weight: 600; margin-bottom: 6px;">Logistics & Courier Profile</div>
        <div style="color: #141414;">Carrier: <strong>BlueDart / Delhivery Express Air</strong></div>
        <div style="color: #141414; margin-top: 2px;">Settlement: <strong>${paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : 'Prepaid (Verified 256-Bit SSL)'}</strong></div>
        <div style="color: #141414; margin-top: 2px;">Delivery Target: <strong>2 – 3 Business Days</strong></div>
        <div style="color: #0F6B38; font-weight: 600; margin-top: 4px;">Direct Doorstep Size Exchange: Enabled (7 Days)</div>
      </div>
    </div>

    <!-- Garment Manifest Table -->
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
      <thead>
        <tr style="border-bottom: 1.5px solid #141414; font-size: 10px; text-transform: uppercase; letter-spacing: 0.15em; color: #73706B; text-align: left;">
          <th style="padding: 10px 8px;">Garment & Materiality</th>
          <th style="padding: 10px 8px; text-align: center;">Qty</th>
          <th style="padding: 10px 8px; text-align: right;">Valuation</th>
        </tr>
      </thead>
      <tbody>
        ${itemsHtml}
      </tbody>
    </table>

    <!-- Totals Summary -->
    <div style="width: 280px; margin-left: auto; margin-bottom: 24px; font-size: 12px;">
      <div style="display: flex; justify-content: space-between; padding: 4px 0; color: #73706B;">
        <span>Subtotal:</span>
        <span style="color: #141414; font-variant-numeric: tabular-nums;">₹${subtotal.toLocaleString('en-IN')}</span>
      </div>
      ${discountAmount > 0 ? `
      <div style="display: flex; justify-content: space-between; padding: 4px 0; color: #0F6B38; font-weight: 600;">
        <span>VIP Promo Privilege:</span>
        <span style="font-variant-numeric: tabular-nums;">-₹${discountAmount.toLocaleString('en-IN')}</span>
      </div>` : ''}
      <div style="display: flex; justify-content: space-between; padding: 4px 0; color: #73706B;">
        <span>Nationwide Express Logistics:</span>
        <span style="color: #141414; font-variant-numeric: tabular-nums;">${shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}</span>
      </div>
      <div style="display: flex; justify-content: space-between; padding: 10px 0; border-top: 2px solid #141414; font-size: 15px; font-weight: bold; color: #141414; margin-top: 6px;">
        <span>Total Settled (GST Incl.):</span>
        <span style="font-variant-numeric: tabular-nums;">₹${totalAmount.toLocaleString('en-IN')}</span>
      </div>
    </div>

    <!-- Sign-off & Client Care Concierge -->
    <div class="signature-area">
      <div>
        <div class="sign-title">Attested & Packed By</div>
        <div class="sign-name">Priyanshu Bipin</div>
        <div style="font-size: 11px; color: #73706B;">Founder & Creative Director • DUKAAN</div>
      </div>

      <div style="text-align: right; font-size: 11px; color: #73706B; line-height: 1.5;">
        <strong style="color: #141414;">24/7 Client Care Concierge:</strong><br>
        WhatsApp / Call: +91 7977641125<br>
        Email: priyanshubipin2006@gmail.com<br>
        Mumbai Studio • Worldwide Courier
      </div>
    </div>

    <div style="text-align: center; margin-top: 28px;">
      <button class="btn-print" onclick="window.print()">Print / Save Archival Good Note</button>
    </div>
  </div>
</body>
</html>`;
}

module.exports = {
  buildGoodNoteHtml,
};
