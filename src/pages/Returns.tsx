import React from 'react';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { Phone, Mail, ArrowRight, RotateCcw, CheckCircle, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Returns: React.FC = () => {
  return (
    <div className="w-full pb-12 bg-[#FAF9F6]">
      {/* Header */}
      <section className="pt-6 sm:pt-8 pb-6 sm:pb-8 bg-white border-b border-[#141414]/10 mb-4">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: 'Easy Returns & Exchanges' }]} className="mb-2" />
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#A7654A] font-semibold block mb-0.5">
            Customer Guarantee
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#141414] font-normal tracking-tight leading-tight">
            Returns & Exchanges
          </h1>
          <p className="text-xs sm:text-sm text-[#73706B] max-w-xl font-light mt-1 leading-relaxed">
            We want you to love what you wear. If the size isn't right or you want an exchange, we offer a simple 7-day doorstep return and replacement service across India.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6 text-xs sm:text-sm text-[#73706B] font-light leading-relaxed">
        {/* Step-by-Step Return Process */}
        <div className="space-y-3">
          <span className="text-[10px] uppercase tracking-widest text-[#A7654A] font-semibold block">
            How It Works
          </span>
          <h3 className="font-serif text-xl sm:text-2xl text-[#141414]">Simple 3-Step Return & Exchange</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-1">
            <div className="p-5 bg-white border border-[#141414]/8 space-y-2">
              <div className="w-8 h-8 rounded-full bg-[#A7654A]/10 flex items-center justify-center tabular-nums text-xs font-bold text-[#A7654A]">
                01
              </div>
              <h4 className="font-serif text-base text-[#141414]">Message on WhatsApp</h4>
              <p className="text-xs leading-relaxed">
                Send a quick message with your order number to <a href="https://wa.me/917977641125" className="text-[#141414] font-medium underline tabular-nums">+91 7977641125</a> or email <a href="mailto:priyanshubipin2006@gmail.com" className="text-[#141414] font-medium underline">priyanshubipin2006@gmail.com</a>.
              </p>
            </div>

            <div className="p-5 bg-white border border-[#141414]/8 space-y-2">
              <div className="w-8 h-8 rounded-full bg-[#A7654A]/10 flex items-center justify-center tabular-nums text-xs font-bold text-[#A7654A]">
                02
              </div>
              <h4 className="font-serif text-base text-[#141414]">Pack the Garment</h4>
              <p className="text-xs leading-relaxed">
                Keep original tags intact, place the unworn and unwashed clothes back in the bag or box. You do not need to print any return label.
              </p>
            </div>

            <div className="p-5 bg-white border border-[#141414]/8 space-y-2">
              <div className="w-8 h-8 rounded-full bg-[#A7654A]/10 flex items-center justify-center tabular-nums text-xs font-bold text-[#A7654A]">
                03
              </div>
              <h4 className="font-serif text-base text-[#141414]">Doorstep Pickup & Refund</h4>
              <p className="text-xs leading-relaxed">
                Our courier partner picks up the packet from your address. For refunds, the amount is sent to your UPI / bank account within 24 to 48 hours.
              </p>
            </div>
          </div>
        </div>

        {/* Free Size Exchange */}
        <div className="space-y-2 p-5 bg-white border border-[#141414]/8">
          <div className="flex items-center gap-2 text-[#141414]">
            <RotateCcw className="w-4 h-4 text-[#A7654A]" />
            <h4 className="font-serif text-base">Free Size Exchange</h4>
          </div>
          <p className="text-xs leading-relaxed">
            Need a larger or smaller size (S, M, L, XL, XXL)? Size exchanges are 100% free with no return pickup fee charged to you.
          </p>
        </div>

        {/* Direct Help Card */}
        <div className="p-5 bg-white border border-[#141414]/8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h4 className="font-serif text-base text-[#141414]">Need help with a return or exchange?</h4>
            <p className="text-xs text-[#73706B] font-light">Contact our team directly on WhatsApp or Call:</p>
            <div className="flex flex-wrap items-center gap-4 mt-2 text-xs">
              <a
                href="https://wa.me/917977641125"
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
            className="h-12 px-8 bg-[#141414] hover:bg-black text-white text-xs uppercase tracking-widest font-semibold rounded-lg shadow-md flex items-center justify-center shrink-0 transition-all active:scale-[0.99]"
          >
            Browse Catalogue
          </Link>
        </div>
      </section>
    </div>
  );
};
