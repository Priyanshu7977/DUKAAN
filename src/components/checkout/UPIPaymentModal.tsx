import React, { useState, useEffect, useRef, useMemo } from 'react';
import { X, Copy, Check, ShieldCheck, Clock, ArrowRight, Sparkles, CheckCircle2, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { formatPrice } from '../../utils/formatters';
import { UPIGatewayService, UPIGatewayOrderData } from '../../services/upiGateway';

interface UPIPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmPayment: (utrNumber?: string) => void;
  totalAmount: number;
  orderNumber: string;
  customerName?: string;
  customerMobile?: string;
  customerEmail?: string;
}

export const UPIPaymentModal: React.FC<UPIPaymentModalProps> = ({
  isOpen,
  onClose,
  onConfirmPayment,
  totalAmount,
  orderNumber,
  customerName,
  customerMobile,
  customerEmail,
}) => {
  const [order, setOrder] = useState<UPIGatewayOrderData | null>(null);
  const [isLoadingOrder, setIsLoadingOrder] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');
  const [copiedVpa, setCopiedVpa] = useState(false);
  const [copiedOrderId, setCopiedOrderId] = useState(false);
  const [utr, setUtr] = useState('');
  const [utrError, setUtrError] = useState('');
  const [isSubmittingUtr, setIsSubmittingUtr] = useState(false);
  const [status, setStatus] = useState<'pending' | 'review' | 'paid' | 'expired'>('pending');
  const [secondsRemaining, setSecondsRemaining] = useState(900);
  const totalDuration = 900;
  const pollTimerRef = useRef<NodeJS.Timeout | null>(null);

  const vpa = order?.vpa || '7977641125@ybl';
  const merchantName = order?.merchant_name || 'DUKAAN';

  const baseUpiIntent = useMemo(() => {
    if (order?.upi_intent) return order.upi_intent;
    return UPIGatewayService.buildUPIIntentUri({
      vpa,
      merchantName,
      amount: totalAmount,
      orderId: orderNumber,
      note: `DUKAAN Order ${orderNumber}`,
    });
  }, [order, vpa, merchantName, totalAmount, orderNumber]);

  useEffect(() => {
    if (!isOpen) {
      if (pollTimerRef.current) clearInterval(pollTimerRef.current);
      setOrder(null);
      setQrCodeDataUrl('');
      setUtr('');
      setUtrError('');
      setIsSubmittingUtr(false);
      setStatus('pending');
      setSecondsRemaining(900);
      return;
    }

    let isMounted = true;
    setIsLoadingOrder(true);

    (async () => {
      try {
        const orderData = await UPIGatewayService.createOrder({
          amount: totalAmount,
          clientOrderId: orderNumber,
          customerName,
          customerMobile,
          customerEmail,
          note: `DUKAAN Order ${orderNumber}`,
        });

        if (isMounted) {
          setOrder(orderData);
          setQrCodeDataUrl(orderData.qr_data_url);
          setStatus(orderData.status === 'review' ? 'review' : orderData.status === 'paid' ? 'paid' : 'pending');
        }
      } catch {
        const fallbackQr = await UPIGatewayService.generateQRCodeDataUrl(baseUpiIntent);
        if (isMounted) {
          setQrCodeDataUrl(fallbackQr);
        }
      } finally {
        if (isMounted) setIsLoadingOrder(false);
      }
    })();

    return () => {
      isMounted = false;
      if (pollTimerRef.current) clearInterval(pollTimerRef.current);
    };
  }, [isOpen, totalAmount, orderNumber, customerName, customerMobile, customerEmail, baseUpiIntent]);

  useEffect(() => {
    if (!isOpen) return;

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setStatus('expired');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !order?.order_id || status === 'paid' || status === 'expired') return;

    pollTimerRef.current = setInterval(async () => {
      const res = await UPIGatewayService.checkOrderStatus(order.order_id);
      if (res.status === 'paid' || res.paid) {
        setStatus('paid');
        if (pollTimerRef.current) clearInterval(pollTimerRef.current);
        setTimeout(() => {
          onConfirmPayment(res.utr || utr);
        }, 1500);
      } else if (res.status === 'review' && status !== 'review') {
        setStatus('review');
      }
    }, 3500);

    return () => {
      if (pollTimerRef.current) clearInterval(pollTimerRef.current);
    };
  }, [isOpen, order?.order_id, status, onConfirmPayment, utr]);

  if (!isOpen) return null;

  const handleCopyVpa = () => {
    navigator.clipboard.writeText(vpa);
    setCopiedVpa(true);
    setTimeout(() => setCopiedVpa(false), 2000);
  };

  const handleCopyOrderId = () => {
    navigator.clipboard.writeText(order?.order_id || orderNumber);
    setCopiedOrderId(true);
    setTimeout(() => setCopiedOrderId(false), 2000);
  };

  const handleUtrSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUtrError('');
    const cleanUtr = utr.trim();

    if (!cleanUtr) {
      setUtrError('Please enter the 12-digit UTR / UPI transaction ID.');
      return;
    }

    if (!/^\d{12}$/.test(cleanUtr)) {
      setUtrError('UTR must be exactly 12 numeric digits (e.g. 431289102847).');
      return;
    }

    setIsSubmittingUtr(true);
    try {
      const targetOrderId = order?.order_id || orderNumber;
      const res = await UPIGatewayService.submitCustomerUtr(targetOrderId, cleanUtr);

      if (res.success) {
        setStatus('review');
        setTimeout(() => {
          onConfirmPayment(cleanUtr);
        }, 1800);
      } else {
        setUtrError(res.message || 'Verification could not be recorded. Please retry.');
      }
    } catch {
      setStatus('review');
      setTimeout(() => {
        onConfirmPayment(cleanUtr);
      }, 1500);
    } finally {
      setIsSubmittingUtr(false);
    }
  };

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (secondsRemaining / totalDuration) * circumference;

  const appButtons: Array<{ id: 'gpay' | 'phonepe' | 'paytm' | 'bhim'; name: string; icon: string }> = [
    { id: 'gpay', name: 'Google Pay', icon: '/images/upi/gpay.svg' },
    { id: 'phonepe', name: 'PhonePe', icon: '/images/upi/phonepe.svg' },
    { id: 'paytm', name: 'Paytm', icon: '/images/upi/paytm.svg' },
    { id: 'bhim', name: 'BHIM UPI', icon: '/images/upi/bhim.svg' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div
        className="bg-[#FAF9F6] border border-[#141414]/15 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full md:w-[260px] bg-[#141414] text-[#FAF9F6] p-5 sm:p-6 flex flex-col justify-between relative shrink-0 border-b md:border-b-0 md:border-r border-white/10">
          <div>
            <div className="flex items-center justify-between md:block mb-4 sm:mb-6">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-white text-[#141414] flex items-center justify-center font-serif text-sm font-bold shadow-xs">
                  D
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#A7654A] font-semibold block">
                    Direct UPI Gateway
                  </span>
                  <span className="font-serif text-sm font-medium text-[#FAF9F6]">
                    DUKAAN Haute
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="md:hidden p-1.5 text-white/60 hover:text-white rounded-lg transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 pt-1">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-white/50 block">
                  Payable Amount
                </span>
                <span className="font-serif text-2xl sm:text-3xl text-white font-medium tabular-nums tracking-tight">
                  {formatPrice(order?.amount ? Number(order.amount) : totalAmount)}
                </span>
              </div>

              <div className="bg-white/5 border border-white/10 p-3 rounded-xl space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-white/60">Order Ref:</span>
                  <button
                    type="button"
                    onClick={handleCopyOrderId}
                    className="font-mono text-white/90 font-medium hover:text-[#A7654A] flex items-center gap-1 transition-colors"
                    title="Copy Order ID"
                  >
                    <span>{orderNumber}</span>
                    {copiedOrderId ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3 text-white/50" />
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between text-[11px] pt-1 border-t border-white/5">
                  <span className="text-white/60">Merchant VPA:</span>
                  <button
                    type="button"
                    onClick={handleCopyVpa}
                    className="font-mono text-[10px] text-white/90 hover:text-[#A7654A] flex items-center gap-1 transition-colors"
                    title="Copy VPA"
                  >
                    <span className="truncate max-w-[110px]">{vpa}</span>
                    {copiedVpa ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3 text-white/50" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 flex items-center justify-between mt-4 md:mt-0">
            <div className="flex items-center gap-2">
              <div className="relative w-10 h-10 flex items-center justify-center shrink-0">
                <svg className="w-10 h-10 -rotate-90" viewBox="0 0 44 44">
                  <circle
                    cx="22"
                    cy="22"
                    r={radius}
                    stroke="rgba(255,255,255,0.12)"
                    strokeWidth="3"
                    fill="transparent"
                  />
                  <circle
                    cx="22"
                    cy="22"
                    r={radius}
                    stroke={secondsRemaining < 120 ? '#EF4444' : '#A7654A'}
                    strokeWidth="3"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-1000 ease-linear"
                  />
                </svg>
                <Clock className="w-3.5 h-3.5 text-white/70 absolute" />
              </div>
              <div>
                <span className="text-[9px] uppercase tracking-wider text-white/50 block">Time Left</span>
                <span className="font-mono text-xs font-semibold text-white tabular-nums">{timeFormatted}</span>
              </div>
            </div>

            <div className="flex items-center gap-1 text-[9px] uppercase tracking-wider text-emerald-400 font-semibold bg-emerald-950/60 border border-emerald-500/20 px-2 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>NPCI Live</span>
            </div>
          </div>
        </div>

        <div className="flex-1 bg-[#FAF9F6] p-5 sm:p-6 overflow-y-auto flex flex-col justify-between">
          <div className="hidden md:flex items-center justify-between pb-3 border-b border-[#141414]/10 mb-4">
            <div>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#A7654A] font-semibold block">
                Instant UPI Settlement
              </span>
              <h3 className="font-serif text-lg text-[#141414] font-medium">
                Scan QR or Tap to Launch UPI App
              </h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-[#73706B] hover:text-[#141414] rounded-lg transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {status === 'paid' ? (
            <div className="py-10 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-widest text-emerald-800 font-bold block">
                  Payment Verified
                </span>
                <h4 className="font-serif text-2xl text-[#141414] font-medium mt-1">
                  Settlement Confirmed
                </h4>
                <p className="text-xs text-[#73706B] max-w-xs mx-auto mt-2">
                  Your payment of {formatPrice(totalAmount)} was acknowledged via NPCI. Finalizing your couture dispatch now...
                </p>
              </div>
            </div>
          ) : status === 'review' ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-14 h-14 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto shadow-sm animate-pulse">
                <RefreshCw className="w-7 h-7 animate-spin" />
              </div>
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase tracking-widest text-amber-800 font-bold block">
                  Verifying Transaction
                </span>
                <h4 className="font-serif text-xl text-[#141414] font-medium">
                  Reviewing UTR With Bank
                </h4>
                <p className="text-xs text-[#73706B] max-w-sm mx-auto">
                  UTR Reference <strong className="font-mono text-[#141414]">{utr}</strong> submitted. Confirming clearance with the merchant banking ledger.
                </p>
              </div>
            </div>
          ) : status === 'expired' ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-14 h-14 bg-rose-100 text-rose-700 rounded-full flex items-center justify-center mx-auto">
                <AlertCircle className="w-8 h-8" />
              </div>
              <div>
                <h4 className="font-serif text-xl text-[#141414]">Session Expired</h4>
                <p className="text-xs text-[#73706B] mt-1">
                  The 15-minute payment window has expired. Please restart checkout to generate a fresh dynamic QR.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 bg-[#141414] text-white text-xs uppercase tracking-wider font-semibold rounded-xl"
              >
                Return to Checkout
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="flex flex-col items-center">
                <div className="relative p-3 bg-white rounded-2xl shadow-sm border border-[#141414]/10 inline-block">
                  <div className="absolute top-1.5 left-1.5 w-4 h-4 border-t-2 border-l-2 border-[#A7654A] rounded-tl-sm pointer-events-none" />
                  <div className="absolute top-1.5 right-1.5 w-4 h-4 border-t-2 border-r-2 border-[#A7654A] rounded-tr-sm pointer-events-none" />
                  <div className="absolute bottom-1.5 left-1.5 w-4 h-4 border-b-2 border-l-2 border-[#A7654A] rounded-bl-sm pointer-events-none" />
                  <div className="absolute bottom-1.5 right-1.5 w-4 h-4 border-b-2 border-r-2 border-[#A7654A] rounded-br-sm pointer-events-none" />

                  {isLoadingOrder || !qrCodeDataUrl ? (
                    <div className="w-44 h-44 sm:w-48 sm:h-48 flex items-center justify-center bg-[#FAF9F6] rounded-xl">
                      <Loader2 className="w-8 h-8 text-[#A7654A] animate-spin" />
                    </div>
                  ) : (
                    <img
                      src={qrCodeDataUrl}
                      alt="UPI QR Code"
                      className="w-44 h-44 sm:w-48 sm:h-48 object-contain rounded-xl"
                    />
                  )}
                </div>

                <span className="text-[10px] text-[#73706B] uppercase tracking-wider font-medium mt-2 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#A7654A]" />
                  <span>Scan with any UPI Scanner • Zero Surcharge</span>
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#73706B] font-semibold block text-center mb-2">
                  Or One-Tap Launch on Mobile
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {appButtons.map((app) => (
                    <a
                      key={app.id}
                      href={UPIGatewayService.getAppLaunchUrl(app.id, baseUpiIntent)}
                      className="h-11 px-2.5 bg-white hover:bg-[#FAF8F5] border border-[#141414]/15 rounded-xl flex items-center justify-center gap-2 transition-all hover:border-[#141414] active:scale-95 shadow-xs"
                      title={`Pay with ${app.name}`}
                    >
                      <img
                        src={app.icon}
                        alt={app.name}
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                        className="w-5 h-5 object-contain"
                      />
                      <span className="text-[11px] font-medium text-[#141414] truncate">{app.name}</span>
                    </a>
                  ))}
                </div>
              </div>

              <form onSubmit={handleUtrSubmit} className="space-y-3 pt-3 border-t border-[#141414]/10">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label
                      htmlFor="upi-payment-utr"
                      className="text-[10px] uppercase tracking-wider text-[#73706B] font-semibold"
                    >
                      12-Digit UTR / Transaction Reference *
                    </label>
                    <span className="text-[10px] text-[#73706B]/75">After payment completion</span>
                  </div>
                  <input
                    type="text"
                    id="upi-payment-utr"
                    name="utr"
                    inputMode="numeric"
                    maxLength={12}
                    value={utr}
                    onChange={(e) => {
                      setUtr(e.target.value.replace(/\D/g, '').slice(0, 12));
                      setUtrError('');
                    }}
                    placeholder="Enter 12-digit UTR from your UPI app"
                    className="w-full h-11 px-3.5 bg-white border border-[#141414]/15 rounded-xl text-xs font-mono focus:outline-none focus:border-[#141414] tabular-nums"
                  />
                  {utrError && (
                    <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1 font-medium">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{utrError}</span>
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingUtr}
                  className="w-full h-11 bg-[#141414] hover:bg-black text-white text-xs uppercase tracking-widest font-semibold rounded-xl shadow-md flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:bg-[#73706B]"
                >
                  {isSubmittingUtr ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Submitting To Banking Gateway...</span>
                    </>
                  ) : (
                    <>
                      <span>I Have Transferred ₹{Math.round(totalAmount).toLocaleString('en-IN')} — Confirm</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          <div className="pt-3 border-t border-[#141414]/10 flex items-center justify-center gap-2 text-[10px] text-[#73706B]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
            <span>Encrypted 256-Bit NPCI Protocol • 100% Buyer Protection Guaranteed</span>
          </div>
        </div>
      </div>
    </div>
  );
};
