import React from 'react';
import { X, Printer, Download, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { formatPrice } from '../../utils/formatters';

interface TaxInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: {
    id: string;
    date: string;
    total: number;
    paymentMethod: string;
    trackingNumber?: string;
    items: Array<{
      id: string;
      name: string;
      price: number;
      size: string;
      color: string;
      quantity: number;
    }>;
    customer?: {
      fullName: string;
      phone: string;
      email?: string;
      address?: string;
      city?: string;
      state?: string;
      pincode?: string;
    };
  };
}

export const TaxInvoiceModal: React.FC<TaxInvoiceModalProps> = ({
  isOpen,
  onClose,
  order,
}) => {
  if (!isOpen) return null;

  const invoiceNumber = `DUK-INV-${order.id.replace(/[^a-zA-Z0-9]/g, '').slice(-8).toUpperCase()}`;
  const invoiceDate = order.date || new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const subtotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const taxableValue = Math.round(subtotal / 1.12);
  const totalGst = subtotal - taxableValue;
  const isMaharashtra = (order.customer?.state || 'Maharashtra').toLowerCase().includes('maharashtra');
  const cgst = isMaharashtra ? Math.round(totalGst / 2) : 0;
  const sgst = isMaharashtra ? Math.round(totalGst / 2) : 0;
  const igst = !isMaharashtra ? totalGst : 0;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white shadow-2xl rounded-sm my-auto max-h-[92vh] flex flex-col overflow-hidden border border-[#141414]/15">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#141414]/10 bg-[#FAF9F6] print:hidden">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#A7654A]" />
            <span className="text-xs uppercase tracking-widest font-semibold text-[#141414]">
              Official GST Tax Invoice
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#141414] hover:bg-black text-white text-[11px] uppercase tracking-wider font-medium rounded-sm transition-all shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center text-[#73706B] hover:text-[#141414] transition-colors rounded-sm"
              aria-label="Close invoice"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-6 sm:p-10 overflow-y-auto font-sans text-[#141414] print:p-0 print:overflow-visible text-xs leading-relaxed space-y-6">
          <div className="flex justify-between items-start border-b border-[#141414]/15 pb-6">
            <div>
              <span className="font-serif text-2xl tracking-[0.25em] font-normal uppercase block text-[#141414]">
                DUKAAN
              </span>
              <span className="text-[10px] uppercase tracking-[0.18em] text-[#73706B] block mt-0.5">
                Objects of Everyday Expression
              </span>
              <p className="mt-2 text-[11px] text-[#73706B] leading-tight">
                Dukaan Atelier Apparel Pvt. Ltd.<br />
                Rampart Row, Kala Ghoda, Fort<br />
                Mumbai, Maharashtra, 400001<br />
                GSTIN: <strong className="text-[#141414]">27AAACD9281F1Z8</strong><br />
                State Code: 27 (Maharashtra)
              </p>
            </div>

            <div className="text-right">
              <span className="inline-block px-2.5 py-1 bg-[#FAF9F6] border border-[#141414]/10 text-[10px] uppercase tracking-wider font-semibold text-[#141414] mb-2">
                Tax Invoice / Cash Memo
              </span>
              <p className="text-[11px] text-[#73706B]">
                Invoice No: <strong className="text-[#141414]">{invoiceNumber}</strong><br />
                Order ID: <span className="font-mono text-[#141414]">{order.id}</span><br />
                Date: <strong className="text-[#141414]">{invoiceDate}</strong><br />
                Payment: <strong className="text-[#141414]">{order.paymentMethod}</strong>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-[#FAF9F6] p-4 border border-[#141414]/10 rounded-sm">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-[#73706B] font-semibold block mb-1">
                Billed & Shipped To (Patron):
              </span>
              <p className="text-xs font-semibold text-[#141414]">
                {order.customer?.fullName || 'Valued DUKAAN Patron'}
              </p>
              <p className="text-[11px] text-[#73706B] mt-0.5">
                {order.customer?.address || 'Patron Residence'}<br />
                {order.customer?.city ? `${order.customer.city}, ` : ''}{order.customer?.state || 'India'}, {order.customer?.pincode || '400001'}<br />
                Phone: {order.customer?.phone || '+91 7977641125'}<br />
                {order.customer?.email && <span>Email: {order.customer.email}</span>}
              </p>
            </div>

            <div className="sm:text-right">
              <span className="text-[10px] uppercase tracking-wider text-[#73706B] font-semibold block mb-1">
                Dispatch & Logistics:
              </span>
              <p className="text-[11px] text-[#73706B]">
                Carrier: <strong className="text-[#141414]">Blue Dart Express Air</strong><br />
                AWB / Tracking: <span className="font-mono text-[#141414]">{order.trackingNumber || 'BD-8829104'}</span><br />
                Place of Supply: <strong className="text-[#141414]">{order.customer?.state || 'Maharashtra'}</strong><br />
                Reverse Charge Applicable: <strong>NO</strong>
              </p>
            </div>
          </div>

          <div className="border border-[#141414]/15 rounded-sm overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF9F6] border-b border-[#141414]/15 text-[10px] uppercase tracking-wider text-[#73706B] font-semibold">
                <tr>
                  <th className="py-2.5 px-3">#</th>
                  <th className="py-2.5 px-3">Garment Description</th>
                  <th className="py-2.5 px-2 text-center">HSN</th>
                  <th className="py-2.5 px-2 text-center">Qty</th>
                  <th className="py-2.5 px-3 text-right">Unit Rate</th>
                  <th className="py-2.5 px-3 text-right">Taxable</th>
                  <th className="py-2.5 px-3 text-right">Total (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#141414]/8">
                {order.items.map((item, idx) => {
                  const itemTotal = item.price * item.quantity;
                  const itemTaxable = Math.round(itemTotal / 1.12);
                  const isShirt = item.name.toLowerCase().includes('shirt') || item.name.toLowerCase().includes('pullover');
                  const hsn = isShirt ? '6205' : '6203';
                  return (
                    <tr key={item.id || idx}>
                      <td className="py-2.5 px-3 text-[#73706B] tabular-nums">{idx + 1}</td>
                      <td className="py-2.5 px-3">
                        <span className="font-medium text-[#141414] block">{item.name}</span>
                        <span className="text-[10px] text-[#73706B]">
                          Size: {item.size} • Color: {item.color}
                        </span>
                      </td>
                      <td className="py-2.5 px-2 text-center text-[#73706B] font-mono text-[11px]">{hsn}</td>
                      <td className="py-2.5 px-2 text-center font-medium tabular-nums">{item.quantity}</td>
                      <td className="py-2.5 px-3 text-right tabular-nums text-[#73706B]">{formatPrice(item.price)}</td>
                      <td className="py-2.5 px-3 text-right tabular-nums text-[#73706B]">{formatPrice(itemTaxable)}</td>
                      <td className="py-2.5 px-3 text-right tabular-nums font-semibold text-[#141414]">{formatPrice(itemTotal)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pt-2">
            <div className="max-w-xs space-y-2 text-[10px] text-[#73706B]">
              <div className="flex items-center gap-1.5 text-emerald-800 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>GST Tax Verified Invoice</span>
              </div>
              <p>
                Whether tax is payable on reverse charge basis: No.<br />
                Goods once sold can be exchanged within 7 days in pristine, unworn condition with tags intact.
              </p>
            </div>

            <div className="w-full sm:w-64 space-y-2 text-xs border border-[#141414]/10 bg-[#FAF9F6] p-3.5 rounded-sm">
              <div className="flex justify-between text-[#73706B]">
                <span>Total Taxable Value:</span>
                <span className="tabular-nums font-medium text-[#141414]">{formatPrice(taxableValue)}</span>
              </div>
              {isMaharashtra ? (
                <>
                  <div className="flex justify-between text-[#73706B]">
                    <span>CGST (6.0%):</span>
                    <span className="tabular-nums text-[#141414]">{formatPrice(cgst)}</span>
                  </div>
                  <div className="flex justify-between text-[#73706B]">
                    <span>SGST (6.0%):</span>
                    <span className="tabular-nums text-[#141414]">{formatPrice(sgst)}</span>
                  </div>
                </>
              ) : (
                <div className="flex justify-between text-[#73706B]">
                  <span>IGST (12.0%):</span>
                  <span className="tabular-nums text-[#141414]">{formatPrice(igst)}</span>
                </div>
              )}
              <div className="flex justify-between text-[#73706B]">
                <span>Insured Air Shipping:</span>
                <span className="text-emerald-700 font-semibold">₹0.00 (Complimentary)</span>
              </div>
              <div className="pt-2 border-t border-[#141414]/15 flex justify-between items-baseline font-semibold text-sm text-[#141414]">
                <span>Invoice Total:</span>
                <span className="font-serif text-base text-[#141414]">{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-[#141414]/15 flex flex-col sm:flex-row justify-between items-end gap-4">
            <div className="text-[10px] text-[#73706B] space-y-1">
              <p className="font-semibold text-[#141414]">DUKAAN Atelier Guarantee</p>
              <p>Hand-tailored in small editions using 100% natural fibers.</p>
              <p>Support: concierge@dukaan-atelier.com • +91 7977641125</p>
            </div>

            <div className="text-center sm:text-right">
              <div className="w-32 h-10 border-b border-[#141414]/40 mx-auto sm:ml-auto mb-1 flex items-center justify-center">
                <span className="font-serif italic text-xs text-[#A7654A] font-medium">Dukaan Atelier</span>
              </div>
              <span className="text-[9px] uppercase tracking-wider text-[#73706B] block">
                Authorized Signatory
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};