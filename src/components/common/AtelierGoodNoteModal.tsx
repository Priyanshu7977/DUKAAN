import React from 'react';
import { X, Printer, MessageSquare, Check, Sparkles, Shield, Heart } from 'lucide-react';
import { OrderNotificationPayload, buildWhatsAppOrderLink } from '../../utils/notificationAutomation';
import { formatPrice } from '../../utils/formatters';

interface AtelierGoodNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: OrderNotificationPayload;
}

export const AtelierGoodNoteModal: React.FC<AtelierGoodNoteModalProps> = ({
  isOpen,
  onClose,
  order,
}) => {
  if (!isOpen) return null;

  const dateStr = new Date(order.createdAt).toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const whatsAppUrl = buildWhatsAppOrderLink(order);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white border border-[#141414]/15 rounded-2xl shadow-2xl overflow-hidden my-6 print:m-0 print:border-none print:shadow-none">

        <div className="px-5 py-3.5 bg-[#FAF9F6] border-b border-[#141414]/10 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2 text-xs text-[#141414]">
            <Sparkles className="w-4 h-4 text-[#A7654A]" />
            <span className="font-semibold uppercase tracking-wider text-[11px]">
              Archival Good Note & Packing Dossier
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#141414]/20 hover:border-[#141414] rounded-lg text-xs font-semibold text-[#141414] transition-all shadow-xs active:scale-95"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-[#73706B] hover:text-[#141414] rounded-full transition-colors"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-6 sm:p-10 bg-white relative space-y-6">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-12 pointer-events-none select-none font-serif text-6xl sm:text-8xl text-black/[0.02] tracking-widest font-bold">
            DUKAAN
          </div>

          <div className="border-b-2 border-[#141414] pb-5 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <h1 className="font-serif text-3xl sm:text-4xl tracking-[0.25em] uppercase text-[#141414] font-normal leading-tight">
                DUKAAN
              </h1>
              <p className="text-[10px] uppercase tracking-[0.25em] text-[#A7654A] font-semibold mt-1">
                Objects of Everyday Expression • Atelier Registry
              </p>
            </div>
            <div className="sm:text-right text-xs text-[#73706B]">
              <div className="text-[10px] uppercase tracking-widest font-semibold text-[#141414]">
                Order Coordinate
              </div>
              <div className="font-mono text-base font-bold text-[#141414] mt-0.5">
                #{order.orderNumber}
              </div>
              <div className="text-[11px] mt-0.5">{dateStr}</div>
            </div>
          </div>

          <div className="bg-[#FAF8F5] border border-[#ECE7DD] border-l-4 border-l-[#A7654A] rounded-xl p-4 sm:p-5 space-y-2">
            <div className="flex items-center gap-1.5 text-xs text-[#A7654A] font-semibold uppercase tracking-wider">
              <Heart className="w-3.5 h-3.5 fill-[#A7654A]" />
              <span>A Personal Note From The Atelier Desk</span>
            </div>
            <p className="text-xs text-[#55524E] leading-relaxed">
              Dear <strong>{order.customerName}</strong>,<br />
              Thank you for welcoming DUKAAN into your wardrobe. Each garment in this dispatch was inspected, hand-steamed, and wrapped in protective natural kraft paper at our Mumbai Atelier.
            </p>
            <p className="text-xs text-[#55524E] leading-relaxed">
              We work exclusively with pure European flax linen, airy double-gauze cotton, and textural micro-corduroy. With wear and gentle laundering, these natural plant fibres will soften to your body’s unique rhythm. Should you require any size exchange, our 7-day complimentary doorstep courier is at your service.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 bg-[#FAF9F6] border border-[#ECE7DD] rounded-xl space-y-1">
              <span className="text-[10px] uppercase tracking-widest text-[#A7654A] font-semibold block">
                Consignee & Destination
              </span>
              <p className="font-semibold text-[#141414]">{order.customerName}</p>
              <p className="text-[#55524E]">{order.shippingAddress.address}</p>
              {order.shippingAddress.area && <p className="text-[#55524E]">{order.shippingAddress.area}</p>}
              <p className="text-[#55524E]">
                {order.shippingAddress.city}, {order.shippingAddress.state} — <span className="font-mono font-bold">{order.shippingAddress.pincode}</span>
              </p>
              <p className="text-[11px] text-[#73706B] pt-1">
                Phone: {order.customerPhone} • Email: {order.customerEmail}
              </p>
            </div>

            <div className="p-3.5 bg-[#FAF9F6] border border-[#ECE7DD] rounded-xl space-y-1">
              <span className="text-[10px] uppercase tracking-widest text-[#A7654A] font-semibold block">
                Logistics & Protocol
              </span>
              <p className="text-[#141414]">Carrier: <strong>BlueDart / Delhivery Express Air</strong></p>
              <p className="text-[#141414]">Payment: <strong>{order.paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : 'Prepaid (256-Bit SSL)'}</strong></p>
              <p className="text-[#141414]">Estimated Delivery: <strong>2 – 3 Business Days</strong></p>
              <p className="text-[11px] text-emerald-800 font-semibold pt-0.5">
                ✓ 7-Day Doorstep Size Replacement Enabled
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b-2 border-[#141414] text-[10px] uppercase tracking-widest text-[#73706B]">
                  <th className="py-2 font-semibold">Garment Piece</th>
                  <th className="py-2 text-center font-semibold">Qty</th>
                  <th className="py-2 text-right font-semibold">Valuation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ECE7DD]">
                {order.items.map((item, idx) => (
                  <tr key={idx}>
                    <td className="py-3">
                      <span className="font-serif text-sm font-semibold text-[#141414] block">
                        {item.name}
                      </span>
                      <span className="text-[10px] uppercase text-[#73706B] tracking-wider block mt-0.5">
                        Shade: {item.color} • Size: {item.size}
                      </span>
                    </td>
                    <td className="py-3 text-center tabular-nums text-[#141414]">
                      {item.quantity}
                    </td>
                    <td className="py-3 text-right font-semibold tabular-nums text-[#141414]">
                      {formatPrice(item.price * item.quantity)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="w-64 ml-auto space-y-1.5 text-xs pt-2">
            <div className="flex justify-between text-[#73706B]">
              <span>Subtotal:</span>
              <span className="text-[#141414] tabular-nums font-medium">{formatPrice(order.subtotal)}</span>
            </div>
            {order.discountAmount > 0 && (
              <div className="flex justify-between text-emerald-700 font-semibold">
                <span>VIP Privilege Discount:</span>
                <span className="tabular-nums">-{formatPrice(order.discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between text-[#73706B]">
              <span>Express Logistics:</span>
              <span className="text-[#141414] tabular-nums">{order.shippingFee === 0 ? 'FREE' : formatPrice(order.shippingFee)}</span>
            </div>
            <div className="flex justify-between text-base font-bold text-[#141414] pt-2 border-t-2 border-[#141414]">
              <span>Total Settled:</span>
              <span className="tabular-nums">{formatPrice(order.totalAmount)}</span>
            </div>
          </div>

          <div className="pt-6 border-t border-[#ECE7DD] flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#73706B] block">
                Attested & Packaged By
              </span>
              <h4 className="font-serif text-base text-[#141414] font-bold mt-0.5">
                Priyanshu Bipin
              </h4>
              <p className="text-[11px] text-[#73706B]">
                Founder & Creative Director • DUKAAN
              </p>
            </div>

            <div className="sm:text-right text-xs text-[#73706B]">
              <strong className="text-[#141414] block">24/7 Client Concierge:</strong>
              <p>WhatsApp / Call: <a href="tel:+917977641125" className="text-[#141414] underline font-medium tabular-nums">+91 7977641125</a></p>
              <p>Email: <a href="mailto:priyanshubipin2006@gmail.com" className="text-[#141414] underline font-medium">priyanshubipin2006@gmail.com</a></p>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center gap-3 print:hidden">
            <a
              href={whatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:flex-1 h-12 bg-emerald-700 hover:bg-emerald-800 text-white text-xs uppercase tracking-wider font-semibold rounded-lg transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Send Receipt Copy on WhatsApp</span>
            </a>

            <button
              onClick={() => window.print()}
              className="w-full sm:w-auto h-12 px-6 border-2 border-[#141414] hover:bg-[#141414] hover:text-white text-[#141414] text-xs uppercase tracking-wider font-semibold rounded-lg transition-all flex items-center justify-center gap-2"
            >
              <Printer className="w-4 h-4" />
              <span>Print Good Note</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
