import React from 'react';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { Mail, Phone } from 'lucide-react';

export const Terms: React.FC = () => {
  return (
    <div className="w-full pb-12 bg-[#FAF9F6]">
      <section className="pt-4 pb-5 bg-white border-b border-[#141414]/8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <Breadcrumbs items={[{ label: 'Client Covenant & Terms of Service' }]} className="mb-2" />
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#A7654A] font-semibold block mb-0.5">
            Legal Covenant
          </span>
          <h1 className="font-serif text-2xl sm:text-4xl text-[#141414] font-normal">
            Terms of Service
          </h1>
          <p className="text-xs sm:text-sm text-[#73706B] max-w-xl font-light mt-1 leading-relaxed">
            Effective Date: May 1, 2025. Standard terms governing international orders, numbered garment ownership, and intellectual property.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 space-y-6 text-xs sm:text-sm text-[#73706B] font-light leading-relaxed">
        <div className="space-y-2.5">
          <h3 className="font-serif text-lg sm:text-xl text-[#141414]">1. Order Placement & Contract Formation</h3>
          <p>
            When you place an order on Dukaan, you receive an automated confirmation verifying receipt of your request. Contractual acceptance takes place when the piece is packed and dispatched via Express courier with live tracking credentials.
          </p>
        </div>

        <div className="space-y-2.5">
          <h3 className="font-serif text-lg sm:text-xl text-[#141414]">2. Pricing, Currencies & Delivered Duty Paid (DDP)</h3>
          <p>
            All listed prices include Delivered Duty Paid (DDP) logistics. You will never encounter unexpected customs tariffs or carrier clearance fees upon parcel arrival. All transactions are settled in selected local currency equivalents.
          </p>
        </div>

        <div className="space-y-2.5">
          <h3 className="font-serif text-lg sm:text-xl text-[#141414]">3. Intellectual Property</h3>
          <p>
            All trademarks, photographic assets, editorial texts, lookbook styling, garment pattern geometries, and branding elements associated with Dukaan are the proprietary property of Dukaan Ltd.
          </p>
        </div>

        <div className="space-y-2.5 p-5 bg-white border border-[#141414]/8">
          <h3 className="font-serif text-base text-[#141414]">4. Legal Notices & Corporate Inquiries</h3>
          <p className="text-xs text-[#73706B]">
            For formal legal dispatches, contractual queries, or client governance questions:
          </p>
          <div className="pt-2 text-xs text-[#141414] space-y-1">
            <p><strong>Primary Client Representative:</strong> Priyanshu Bipin</p>
            <p>
              Mobile / WhatsApp:{' '}
              <a href="tel:+917977641125" className="hover:text-[#A7654A] tabular-nums font-medium underline">
                +91 7977641125
              </a>
            </p>
            <p>
              Direct Legal & Client Care Email:{' '}
              <a href="mailto:priyanshubipin2006@gmail.com" className="hover:text-[#A7654A] font-medium underline">
                priyanshubipin2006@gmail.com
              </a>
            </p>
            <p className="text-[11px] text-[#73706B]">Showrooms: Via della Spiga 14, Milano • 42 Redchurch St, London</p>
          </div>
        </div>
      </section>
    </div>
  );
};
