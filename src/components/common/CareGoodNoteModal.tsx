import React from 'react';
import { X, Printer, MessageSquare, Sparkles, Heart } from 'lucide-react';
import { OrderNotificationPayload, buildWhatsAppOrderLink } from '../../utils/notificationAutomation';
import { formatPrice } from '../../utils/formatters';

interface CareGoodNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: OrderNotificationPayload;
}

export const CareGoodNoteModal: React.FC<CareGoodNoteModalProps> = ({
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/70 backdrop-blur-xs overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white border border-[#141414]/15 rounded-xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col print:max-h-none print:m-0 print:border-none print:shadow-none print:rounded-none">
        
        <div className="px-4 sm:px-5 py-3 bg-[#FAF9F6] border-b border-[#141414]/10 flex items-center justify-between shrink-0 print:hidden">
          <div className="flex items-center gap-2 text-xs text-[#141414]">
            <Sparkles className="w-3.5 h-3.5 text-[#A7654A]" />
            <span className="font-semibold uppercase tracking-wider text-[10px] sm:text-[11px]">
              Archival Good Note & Packing Dossier
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#141414]/20 hover:border-[#141414] rounded-md text-xs font-semibold text-[#141414] transition-all shadow-xs active:scale-95"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print / Save PDF</span>
              <span className="sm:hidden">Print</span>
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

        <div className="p-4 sm:p-7 bg-white relative space-y-4 sm:space-y-5 overflow-y-auto flex-1">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-12 pointer-events-none select-none font-serif text-5xl sm:text-8xl text-black/[0.02] tracking-widest font-bold">
            DUKAAN
          </div>

          <div className="border-b-2 border-[#141414] pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-2.5">
            <div>
              <h1 className="font-serif text-2xl sm:text-3xl tracking-[0.2em] uppercase text-[#141414] font-normal leading-tight">
                DUKAAN
              </h1>
              <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-[#A7654A] font-semibold mt-0.5">
                Objects of Everyday Expression • DUKAAN Registry
              </p>
            </div>
            <div className="sm:text-right text-xs text-[#73706B]">
              <div className="text-[9px] uppercase tracking-wider font-semibold text-[#141414]">
                Order Coordinate
              </div>
              <div className="font-mono text-sm sm:text-base font-bold text-[#141414] mt-0.5">
                #{order.orderNumber}
              </div>
              <div className="text-[10px] sm:text-[11px] mt-0.5">{dateStr}</div>
            </div>
          </div>

          <div className="bg-[#FAF8F5] border border-[#ECE7DD] border-l-4 border-l-[#A7654A] rounded-lg p-3 sm:p-4 space-y-1.5">
            <div className="flex items-center gap-1.5 text-[11px] text-[#A7654A] font-semibold uppercase tracking-wider">
              <Heart className="w-3 h-3 fill-[#A7654A]" />
              <span>A Personal Note From The DUKAAN Desk</span>
            </div>
            <p className="text-[11px] sm:text-xs text-[#55524E] leading-relaxed">
              Dear <strong>{order.customerName}</strong>,<br />
              Thank you for welcoming DUKAAN into your wardrobe. Each garment in this dispatch was inspected, hand-steamed, and wrapped in protective natural kraft paper at our Mumbai Studio.
            </p>
            <p className="text-[11px] sm:text-xs text-[#55524E] leading-relaxed">
              We work exclusively with pure European flax linen, airy double-gauze cotton, and textural micro-corduroy. With wear and gentle laundering, these natural plant fibres will soften to your body’s unique rhythm. Should you require any size exchange, our 7-day complimentary doorstep courier is at your service.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
            <div className="p-3 bg-[#FAF9F6] border border-[#ECE7DD] rounded-lg space-y-1">
              <span className="text-[9px] uppercase tracking-wider text-[#A7654A] font-semibold block">
                Consignee & Destination
              </span>
              <p className="font-semibold text-[#141414] text-xs">{order.customerName}</p>
              <p className="text-[#55524E] text-[11px] leading-tight">{order.shippingAddress.address}</p>
              {order.shippingAddress.area && <p className="text-[#55524E] text-[11px] leading-tight">{order.shippingAddress.area}</p>}
              <p className="text-[#55524E] text-[11px]">
                {order.shippingAddress.city}, {order.shippingAddress.state}, <span className="font-mono font-bold">{order.shippingAddress.pincode}</span>
              </p>
              <p className="text-[10px] text-[#73706B] pt-0.5">
                Phone: {order.customerPhone} • Email: {order.customerEmail}
              </p>
            </div>

            <div className="p-3 bg-[#FAF9F6] border border-[#ECE7DD] rounded-lg space-y-1">
              <span className="text-[9px] uppercase tracking-wider text-[#A7654A] font-semibold block">
                Logistics & Protocol
              </span>
              <p className="text-[#141414] text-[11px]">Carrier: <strong>BlueDart / Delhivery Express Air</strong></p>
              <p className="text-[#141414] text-[11px]">Payment: <strong>{order.paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : 'Prepaid (256-Bit SSL)'}</strong></p>
              <p className="text-[#141414] text-[11px]">Estimated Delivery: <strong>2 to 3 Business Days</strong></p>
              <p className="text-[10px] text-emerald-800 font-semibold pt-0.5">
                ✓ 7-Day Doorstep Size Replacement Enabled
              </p>
            </div>
          </div>

          <div className="overflow-x-auto -mx-1 px-1">
            <table className="w-full text-left text-xs border-collapse min-w-[280px]">
              <thead>
                <tr className="border-b-2 border-[#141414] text-[9px] sm:text-[10px] uppercase tracking-wider text-[#73706B]">
                  <th className="py-2 font-semibold">Garment Piece</th>
                  <th className="py-2 text-center font-semibold">Qty</th>
                  <th className="py-2 text-right font-semibold">Valuation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ECE7DD]">
                {order.items.map((item, idx) => (
                  <tr key={idx}>
                    <td className="py-2.5">
                      <span className="font-serif text-xs sm:text-sm font-semibold text-[#141414] block">
                        {item.name}
                      </span>
                      <span className="text-[9px] uppercase text-[#73706B] tracking-wider block mt-0.5">
                        Shade: {item.color} • Size: {item.size}
                      </span>
                    </td>
                    <td className="py-2.5 text-center tabular-nums text-xs text-[#141414]">
                      {item.quantity}
                    </td>
                    <td className="py-2.5 text-right font-semibold tabular-nums text-xs text-[#141414]">
                      {formatPrice(item.price * item.quantity)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="w-full sm:w-60 sm:ml-auto space-y-1.5 text-xs pt-1 border-t border-[#ECE7DD] sm:border-t-0">
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
            <div className="flex justify-between text-sm sm:text-base font-bold text-[#141414] pt-1.5 border-t-2 border-[#141414]">
              <span>Total Settled:</span>
              <span className="tabular-nums">{formatPrice(order.totalAmount)}</span>
            </div>
          </div>

          <div className="pt-4 border-t border-[#ECE7DD] flex flex-col sm:flex-row sm:items-end justify-between gap-3 text-xs">
            <div>
              <span className="text-[9px] uppercase tracking-wider text-[#73706B] block">
                Attested & Packaged By
              </span>
              <h4 className="font-serif text-sm sm:text-base text-[#141414] font-bold mt-0.5">
                Priyanshu Bipin
              </h4>
              <p className="text-[10px] text-[#73706B]">
                Founder & Creative Director • DUKAAN
              </p>
            </div>

            <div className="sm:text-right text-[11px] text-[#73706B] space-y-0.5">
              <strong className="text-[#141414] block">24/7 Client Concierge:</strong>
              <p>WhatsApp / Call: <a href="tel:+917977641125" className="text-[#141414] underline font-medium tabular-nums">+91 7977641125</a></p>
              <p>Email: <a href="mailto:priyanshubipin2006@gmail.com" className="text-[#141414] underline font-medium">priyanshubipin2006@gmail.com</a></p>
            </div>
          </div>

          <div className="pt-3 flex flex-col sm:flex-row items-center gap-2.5 print:hidden">
            <a
              href={whatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:flex-1 h-10 bg-emerald-700 hover:bg-emerald-800 text-white text-[10px] sm:text-[11px] uppercase tracking-wider font-semibold rounded-md transition-all flex items-center justify-center gap-1.5 shadow-xs"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Send Receipt Copy on WhatsApp</span>
            </a>

            <button
              onClick={() => window.print()}
              className="w-full sm:w-auto h-10 px-5 border border-[#141414] hover:bg-[#141414] hover:text-white text-[#141414] text-[10px] sm:text-[11px] uppercase tracking-wider font-semibold rounded-md transition-all flex items-center justify-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Good Note</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
