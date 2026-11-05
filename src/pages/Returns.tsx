import React, { useState } from 'react';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { Phone, Mail, ArrowRight, RotateCcw, CheckCircle, ShieldCheck, Sparkles, Package, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Returns: React.FC = () => {
  const [orderId, setOrderId] = useState('');
  const [phone, setPhone] = useState('');
  const [requestType, setRequestType] = useState<'exchange' | 'refund'>('exchange');
  const [targetSize, setTargetSize] = useState('M');
  const [reason, setReason] = useState('Size runs smaller than expected');
  const [comments, setComments] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [returnRef, setReturnRef] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim()) return;
    const ref = `RET-${Math.floor(100000 + Math.random() * 900000)}`;
    setReturnRef(ref);
    setIsSubmitted(true);
  };

  return (
    <div className="w-full pb-16 bg-[#FAF9F6]">
      <section className="pt-6 sm:pt-8 pb-6 sm:pb-8 bg-white border-b border-[#141414]/10 mb-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: 'Easy Returns & Exchanges' }]} className="mb-2" />
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#A7654A] font-semibold block mb-0.5">
            Customer Guarantee
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#141414] font-normal tracking-tight">
            Returns & Doorstep Exchanges
          </h1>
          <p className="text-xs sm:text-sm text-[#73706B] max-w-xl font-light mt-1">
            We want you to feel confident in every garment. We provide a 7-day doorstep size replacement service with zero return pickup charges anywhere in India.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#141414]/10 shadow-sm">
          <div className="max-w-2xl">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#A7654A] font-semibold block mb-1">
              Automated Self-Service Portal
            </span>
            <h2 className="font-serif text-xl sm:text-2xl text-[#141414] font-medium">
              Initiate Return or Size Replacement
            </h2>
            <p className="text-xs text-[#73706B] font-light mt-1 mb-6">
              Enter your Order ID to schedule a courier doorstep pickup from your delivery address.
            </p>

            {isSubmitted ? (
              <div className="p-6 bg-[#FAF8F5] border border-emerald-300 rounded-2xl space-y-4 animate-fade-in">
                <div className="flex items-center gap-2 text-emerald-800">
                  <CheckCircle className="w-6 h-6 shrink-0" />
                  <h3 className="font-serif text-lg font-medium">
                    Reverse Pickup Request Confirmed!
                  </h3>
                </div>

                <div className="text-xs text-[#73706B] space-y-1.5 leading-relaxed">
                  <p>
                    Request ID:{' '}
                    <strong className="text-[#141414] font-mono font-semibold">{returnRef}</strong> • Order ID:{' '}
                    <strong className="text-[#141414] font-mono">{orderId.toUpperCase()}</strong>
                  </p>
                  <p>
                    Action:{' '}
                    <strong className="text-[#141414]">
                      {requestType === 'exchange' ? `Free Size Exchange to Size ${targetSize}` : 'Return for 100% Refund'}
                    </strong>
                  </p>
                  <p>
                    Our courier partner (BlueDart / Delhivery) will arrive at your address within <strong>24 to 48 hours</strong> to collect the parcel. Please keep the garment in its original dust bag with tags attached.
                  </p>
                </div>

                <div className="pt-2 flex flex-wrap gap-3">
                  <a
                    href={`https://wa.me/917977641125?text=${encodeURIComponent(
                      `Hello DUKAAN Atelier, I have initiated a return/exchange request (${returnRef}) for Order ${orderId}.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs uppercase tracking-wider font-semibold rounded-lg transition-colors inline-flex items-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5 fill-white" />
                    <span>WhatsApp Concierge Update</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => {
                      setIsSubmitted(false);
                      setOrderId('');
                    }}
                    className="px-4 py-2.5 bg-white border border-[#141414]/15 hover:border-[#141414] text-[#141414] text-xs uppercase tracking-wider font-medium rounded-lg transition-colors"
                  >
                    Start Another Request
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#73706B] font-semibold mb-1">
                      Order Reference ID *
                    </label>
                    <input
                      type="text"
                      required
                      value={orderId}
                      onChange={(e) => setOrderId(e.target.value)}
                      placeholder="e.g. DUK-IN-882194"
                      className="w-full h-11 px-3.5 bg-[#FAF9F6] border border-[#141414]/15 rounded-xl text-xs font-mono focus:outline-none focus:border-[#141414]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#73706B] font-semibold mb-1">
                      Mobile Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder="10-digit delivery mobile"
                      className="w-full h-11 px-3.5 bg-[#FAF9F6] border border-[#141414]/15 rounded-xl text-xs font-mono focus:outline-none focus:border-[#141414]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#73706B] font-semibold mb-1">
                    Select Resolution
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setRequestType('exchange')}
                      className={`p-3 text-left border rounded-xl transition-all ${
                        requestType === 'exchange'
                          ? 'border-[#141414] bg-[#141414] text-white shadow-sm'
                          : 'border-[#141414]/15 bg-white text-[#141414] hover:border-[#141414]'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 font-semibold text-xs">
                        <RotateCcw className="w-3.5 h-3.5 text-[#A7654A]" />
                        <span>Free Size Exchange</span>
                      </div>
                      <p className={`text-[11px] font-light mt-0.5 ${requestType === 'exchange' ? 'text-gray-300' : 'text-[#73706B]'}`}>
                        Doorstep replacement delivered with no extra fee
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRequestType('refund')}
                      className={`p-3 text-left border rounded-xl transition-all ${
                        requestType === 'refund'
                          ? 'border-[#141414] bg-[#141414] text-white shadow-sm'
                          : 'border-[#141414]/15 bg-white text-[#141414] hover:border-[#141414]'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 font-semibold text-xs">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Return for Full Refund</span>
                      </div>
                      <p className={`text-[11px] font-light mt-0.5 ${requestType === 'refund' ? 'text-gray-300' : 'text-[#73706B]'}`}>
                        Money refunded to UPI / Bank within 24-48 hrs of pickup
                      </p>
                    </button>
                  </div>
                </div>

                {requestType === 'exchange' && (
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#73706B] font-semibold mb-1">
                      Select Replacement Size
                    </label>
                    <div className="flex items-center gap-2">
                      {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((sz) => (
                        <button
                          key={sz}
                          type="button"
                          onClick={() => setTargetSize(sz)}
                          className={`w-10 h-10 rounded-lg text-xs font-semibold border transition-all ${
                            targetSize === sz
                              ? 'bg-[#141414] text-white border-[#141414]'
                              : 'bg-white text-[#141414] border-[#141414]/15 hover:border-[#141414]'
                          }`}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#73706B] font-semibold mb-1">
                    Reason for Return / Exchange
                  </label>
                  <select
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full h-11 px-3 bg-[#FAF9F6] border border-[#141414]/15 rounded-xl text-xs focus:outline-none focus:border-[#141414]"
                  >
                    <option value="Size runs smaller than expected">Size runs smaller than expected</option>
                    <option value="Size runs larger than expected">Size runs larger than expected</option>
                    <option value="Color or fabric texture differs from screen">Color or fabric texture differs from screen</option>
                    <option value="Ordered multiple sizes to try">Ordered multiple sizes to try</option>
                    <option value="Defect or stitching flaw noticed">Defect or stitching flaw noticed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#73706B] font-semibold mb-1">
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    placeholder="Provide any specific instructions for the pickup executive..."
                    className="w-full p-3 bg-[#FAF9F6] border border-[#141414]/15 rounded-xl text-xs focus:outline-none focus:border-[#141414]"
                  />
                </div>

                <button
                  type="submit"
                  className="h-12 px-8 bg-[#141414] hover:bg-black text-white text-xs uppercase tracking-widest font-semibold rounded-xl shadow-md transition-all active:scale-[0.99] flex items-center justify-center gap-2"
                >
                  <span>Submit Pickup Request</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <span className="text-[10px] uppercase tracking-widest text-[#A7654A] font-semibold block">
            Atelier Standards
          </span>
          <h3 className="font-serif text-xl sm:text-2xl text-[#141414]">
            Simple 3-Step Return Process
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-1">
            <div className="p-5 bg-white border border-[#141414]/8 rounded-2xl space-y-2 shadow-xs">
              <div className="w-8 h-8 rounded-full bg-[#A7654A]/10 flex items-center justify-center tabular-nums text-xs font-bold text-[#A7654A]">
                01
              </div>
              <h4 className="font-serif text-base text-[#141414]">Submit Request Online</h4>
              <p className="text-xs text-[#73706B] leading-relaxed font-light">
                Enter your order ID above or send a message to our WhatsApp Concierge at +91 7977641125.
              </p>
            </div>

            <div className="p-5 bg-white border border-[#141414]/8 rounded-2xl space-y-2 shadow-xs">
              <div className="w-8 h-8 rounded-full bg-[#A7654A]/10 flex items-center justify-center tabular-nums text-xs font-bold text-[#A7654A]">
                02
              </div>
              <h4 className="font-serif text-base text-[#141414]">Doorstep Package Pickup</h4>
              <p className="text-xs text-[#73706B] leading-relaxed font-light">
                BlueDart / Delhivery collects the parcel directly from your doorstep. No printing or label attachment needed.
              </p>
            </div>

            <div className="p-5 bg-white border border-[#141414]/8 rounded-2xl space-y-2 shadow-xs">
              <div className="w-8 h-8 rounded-full bg-[#A7654A]/10 flex items-center justify-center tabular-nums text-xs font-bold text-[#A7654A]">
                03
              </div>
              <h4 className="font-serif text-base text-[#141414]">Instant Dispatch or Refund</h4>
              <p className="text-xs text-[#73706B] leading-relaxed font-light">
                Exchanged sizes dispatch within 24 hours. Refunds are credited via instant UPI / IMPS within 48 hours.
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 bg-white border border-[#141414]/10 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
          <div>
            <h4 className="font-serif text-base text-[#141414]">Need personalized assistance?</h4>
            <p className="text-xs text-[#73706B] font-light">
              Speak directly with an atelier stylist via WhatsApp or telephone:
            </p>
            <div className="flex flex-wrap items-center gap-4 mt-2 text-xs">
              <a
                href="https://wa.me/917977641125"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-700 underline font-semibold flex items-center gap-1.5"
              >
                <span>WhatsApp: +91 7977641125</span>
              </a>
              <a
                href="mailto:priyanshubipin2006@gmail.com"
                className="text-[#141414] underline font-medium flex items-center gap-1.5"
              >
                <span>Email: priyanshubipin2006@gmail.com</span>
              </a>
            </div>
          </div>
          <Link
            to="/shop"
            className="h-12 px-8 bg-[#141414] hover:bg-black text-white text-xs uppercase tracking-widest font-semibold rounded-xl shadow-md flex items-center justify-center shrink-0 transition-all active:scale-[0.99]"
          >
            Explore Wardrobe
          </Link>
        </div>
      </section>
    </div>
  );
};
