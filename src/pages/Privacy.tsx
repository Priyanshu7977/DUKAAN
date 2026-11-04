import React from 'react';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { Mail, Phone } from 'lucide-react';

export const Privacy: React.FC = () => {
  return (
    <div className="w-full pb-12 bg-[#FAF9F6]">
      <section className="pt-4 pb-5 bg-white border-b border-[#141414]/8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <Breadcrumbs items={[{ label: 'Privacy & Data Governance' }]} className="mb-2" />
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#A7654A] font-semibold block mb-0.5">
            Legal & Data Governance
          </span>
          <h1 className="font-serif text-2xl sm:text-4xl text-[#141414] font-normal">
            Privacy Policy
          </h1>
          <p className="text-xs sm:text-sm text-[#73706B] max-w-xl font-light mt-1 leading-relaxed">
            Effective Date: May 1, 2025. Last revised under GDPR, CCPA, and international Digital Personal Data Protection standards.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 space-y-6 text-xs sm:text-sm text-[#73706B] font-light leading-relaxed">
        <div className="p-5 bg-white border border-[#141414]/8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] uppercase tracking-widest text-[#A7654A] font-semibold block">
              Designated Data Protection Officer (DPO)
            </span>
            <h4 className="font-serif text-base text-[#141414]">Priyanshu Bipin — Lead Data Governance</h4>
            <p className="text-xs text-[#73706B]">Dukaan Apparel Private Ltd. • Customer Protection Office</p>
          </div>
          <div className="flex flex-col gap-1 text-xs text-[#141414]">
            <a href="tel:+917977641125" className="flex items-center gap-2 hover:text-[#A7654A] transition-colors tabular-nums font-medium">
              <Phone className="w-3.5 h-3.5 text-[#A7654A]" />
              <span>+91 7977641125</span>
            </a>
            <a href="mailto:priyanshubipin2006@gmail.com" className="flex items-center gap-2 hover:text-[#A7654A] transition-colors font-medium">
              <Mail className="w-3.5 h-3.5 text-[#A7654A]" />
              <span>priyanshubipin2006@gmail.com</span>
            </a>
          </div>
        </div>

        <div className="space-y-2.5">
          <h3 className="font-serif text-lg sm:text-xl text-[#141414]">1. Purpose & Core Principles</h3>
          <p>
            Dukaan ("we", "our") is committed to absolute discretion and respectful stewardship of client personal records. We collect and process personal data exclusively to prepare bespoke wardrobe pieces, fulfill worldwide air courier deliveries, issue transparent invoices, and transmit curated notifications with explicit client consent.
          </p>
          <p>
            We adhere strictly to the principle of <strong>Data Minimization</strong>: we never collect extraneous behavioral dossiers, never monetize client information, and never transmit your records to marketing syndicates or unauthorized third-party brokerages.
          </p>
        </div>

        <div className="space-y-2.5">
          <h3 className="font-serif text-lg sm:text-xl text-[#141414]">2. Categories of Information Collected</h3>
          <p>
            To deliver your order seamlessly, we collect only essential coordinates:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs">
            <li><strong>Identity Coordinates:</strong> Full client name, title, and contact preferences.</li>
            <li><strong>Fulfillment Logistics:</strong> Physical shipping and billing addresses, apartment/suite credentials, and telephone numbers for live courier dispatch notifications.</li>
            <li><strong>Transaction Telemetry:</strong> Anonymized payment confirmations processed securely via Level-1 PCI-DSS certified gateways (Stripe, Razorpay, Apple Pay). Dukaan never stores raw credit card numbers.</li>
            <li><strong>Atelier Sizing Notes:</strong> Bespoke measurements, sleeve lengths, and preferred fit silhouettes recorded during private concierge consultations.</li>
          </ul>
        </div>

        <div className="space-y-2.5">
          <h3 className="font-serif text-lg sm:text-xl text-[#141414]">3. Data Subject Rights & Deletion Inquiries</h3>
          <p>
            Under European GDPR and California CCPA regulations, you hold the sovereign right to inspect, export, correct, or permanently erase your client dossier from our database at any time. Simply contact Data Protection Officer Priyanshu Bipin at <a href="mailto:priyanshubipin2006@gmail.com" className="text-[#141414] font-medium underline">priyanshubipin2006@gmail.com</a>.
          </p>
        </div>
      </section>
    </div>
  );
};
