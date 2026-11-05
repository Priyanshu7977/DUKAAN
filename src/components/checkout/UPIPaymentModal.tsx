import React, { useState, useEffect } from 'react';
import { X, Copy, Check, ExternalLink, ShieldCheck, Clock, ArrowRight, Sparkles } from 'lucide-react';
import { formatPrice } from '../../utils/formatters';

interface UPIPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmPayment: (utrNumber?: string) => void;
  totalAmount: number;
  orderNumber: string;
}

interface UPIMethod {
  id: 'phonepe' | 'gpay' | 'paytm';
  name: string;
  upiId: string;
  qrImage: string;
  accentColor: string;
}

const UPI_METHODS: UPIMethod[] = [
  {
    id: 'phonepe',
    name: 'PhonePe',
    upiId: '7977641125@ybl',
    qrImage: '/images/qr/phonepe_qr.png',
    accentColor: '#5f259f',
  },
  {
    id: 'gpay',
    name: 'Google Pay',
    upiId: '7977641125@upi',
    qrImage: '/images/qr/gpay_qr.png',
    accentColor: '#1a73e8',
  },
  {
    id: 'paytm',
    name: 'Paytm',
    upiId: '7977641125@ptyes',
    qrImage: '/images/qr/paytm_qr.png',
    accentColor: '#00b9f5',
  },
];

export const UPIPaymentModal: React.FC<UPIPaymentModalProps> = ({
  isOpen,
  onClose,
  onConfirmPayment,
  totalAmount,
  orderNumber,
}) => {
  const [activeTab, setActiveTab] = useState<'phonepe' | 'gpay' | 'paytm'>('phonepe');
  const [copied, setCopied] = useState(false);
  const [utr, setUtr] = useState('');
  const [timeLeft, setTimeLeft] = useState(600);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setTimeLeft(600);
      setCopied(false);
      setUtr('');
      setIsVerifying(false);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const currentMethod = UPI_METHODS.find((m) => m.id === activeTab) || UPI_METHODS[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentMethod.upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const upiIntentUri = `upi://pay?pa=${encodeURIComponent(currentMethod.upiId)}&pn=${encodeURIComponent(
    'DUKAAN Atelier'
  )}&am=${totalAmount}&cu=INR&tn=${encodeURIComponent(`Order ${orderNumber}`)}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      onConfirmPayment(utr.trim());
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        className="bg-[#FAF9F6] border border-[#141414]/15 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 py-4 bg-white border-b border-[#141414]/10 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#A7654A] font-semibold block">
              Official UPI Gateway
            </span>
            <h3 className="font-serif text-lg sm:text-xl text-[#141414] font-medium">
              Scan & Pay with Any UPI App
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#73706B] hover:text-[#141414] rounded-lg transition-colors"
            aria-label="Close UPI payment modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto p-5 sm:p-6 space-y-5">
          <div className="bg-[#FAF8F5] p-4 rounded-xl border border-[#141414]/10 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-[#73706B] uppercase tracking-wider block">
                Total Payable Amount
              </span>
              <span className="font-serif text-2xl font-semibold text-[#141414]">
                {formatPrice(totalAmount)}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-[#73706B] block">Order Ref</span>
              <span className="text-xs font-mono font-semibold text-[#141414]">
                {orderNumber}
              </span>
              <div className="flex items-center gap-1 text-[11px] text-amber-800 justify-end mt-0.5">
                <Clock className="w-3 h-3" />
                <span className="tabular-nums font-semibold">{timeFormatted}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-[#141414]/10">
            {UPI_METHODS.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setActiveTab(m.id)}
                className={`flex-1 py-2 px-2 text-xs font-medium rounded-lg transition-all text-center ${
                  activeTab === m.id
                    ? 'bg-[#141414] text-white shadow-sm'
                    : 'text-[#73706B] hover:text-[#141414] hover:bg-[#FAF9F6]'
                }`}
              >
                {m.name}
              </button>
            ))}
          </div>

          <div className="flex flex-col items-center text-center space-y-3">
            <div className="p-3 bg-white border border-[#141414]/15 rounded-2xl shadow-md inline-block max-w-[260px]">
              <img
                src={currentMethod.qrImage}
                alt={`${currentMethod.name} QR Code`}
                className="w-52 h-52 object-contain mx-auto rounded-lg"
              />
            </div>

            <div className="w-full max-w-sm flex items-center justify-between gap-2 bg-white px-3.5 py-2.5 rounded-xl border border-[#141414]/10">
              <div className="text-left min-w-0">
                <span className="text-[10px] text-[#73706B] uppercase tracking-wider block">
                  UPI ID ({currentMethod.name})
                </span>
                <span className="text-xs sm:text-sm font-mono font-semibold text-[#141414] truncate block">
                  {currentMethod.upiId}
                </span>
              </div>
              <button
                type="button"
                onClick={handleCopy}
                className="px-3 py-1.5 bg-[#FAF8F5] hover:bg-[#ECE7DD] border border-[#141414]/10 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 shrink-0"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-700" />
                    <span className="text-emerald-800 text-[11px]">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-[#141414]" />
                    <span className="text-[11px]">Copy ID</span>
                  </>
                )}
              </button>
            </div>

            <a
              href={upiIntentUri}
              className="sm:hidden w-full max-w-sm py-2.5 px-4 bg-[#141414] text-white text-xs uppercase tracking-wider font-semibold rounded-xl flex items-center justify-center gap-2 active:scale-[0.99] transition-transform"
            >
              <span>Pay Via Installed UPI App</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3 pt-1 border-t border-[#141414]/10">
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#73706B] font-semibold mb-1">
                UPI Reference / UTR Number (Optional)
              </label>
              <input
                type="text"
                value={utr}
                onChange={(e) => setUtr(e.target.value.replace(/[^a-zA-Z0-9]/g, ''))}
                placeholder="e.g. 431289102847 (12-digit UTR)"
                maxLength={20}
                className="w-full h-11 px-3.5 bg-white border border-[#141414]/15 rounded-xl text-xs font-mono focus:outline-none focus:border-[#141414]"
              />
            </div>

            <button
              type="submit"
              disabled={isVerifying}
              className="w-full h-12 bg-[#141414] hover:bg-black disabled:bg-gray-400 text-white text-xs uppercase tracking-widest font-semibold rounded-xl shadow-md flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
            >
              {isVerifying ? (
                <span>Verifying UPI Transfer...</span>
              ) : (
                <>
                  <span>I Have Paid — Confirm Order</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="flex items-center justify-center gap-2 text-[10px] text-[#73706B] pt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span>256-Bit Encrypted Indian Banking Gateway • Instant Payment Receipt</span>
          </div>
        </div>
      </div>
    </div>
  );
};
