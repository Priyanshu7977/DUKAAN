import React from 'react';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { Truck, ShieldCheck, PackageCheck, Phone, Mail, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Shipping: React.FC = () => {
  return (
    <div className="w-full pb-12 bg-[#FAF9F6]">
      {/* Header */}
      <section className="pt-6 sm:pt-8 pb-6 sm:pb-8 bg-white border-b border-[#141414]/10 mb-4">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: 'Shipping & Delivery' }]} className="mb-2" />
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#A7654A] font-semibold block mb-0.5">
            Delivery Policy
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#141414] font-normal tracking-tight leading-tight">
            Shipping & Delivery
          </h1>
          <p className="text-xs sm:text-sm text-[#73706B] max-w-2xl font-light mt-1 leading-relaxed">
            We deliver to over 19,000+ PIN codes across India. Every order is carefully hand-checked, packed in premium dust bags, and shipped quickly with live tracking updates.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* Key Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="p-5 bg-white border border-[#141414]/8 space-y-2">
            <div className="w-9 h-9 rounded-full bg-[#A7654A]/10 flex items-center justify-center text-[#A7654A]">
              <Truck className="w-4 h-4" />
            </div>
            <h4 className="font-serif text-base text-[#141414]">Free Shipping Above ₹1,999</h4>
            <p className="text-xs text-[#73706B] font-light leading-relaxed">
              All orders of ₹1,999 or more qualify for completely FREE express doorstep delivery anywhere in India.
            </p>
          </div>

          <div className="p-5 bg-white border border-[#141414]/8 space-y-2">
            <div className="w-9 h-9 rounded-full bg-[#A7654A]/10 flex items-center justify-center text-[#A7654A]">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h4 className="font-serif text-base text-[#141414]">Cash on Delivery (COD)</h4>
            <p className="text-xs text-[#73706B] font-light leading-relaxed">
              Convenient COD option available across most Indian PIN codes. Pay with cash or UPI at the time of delivery.
            </p>
          </div>

          <div className="p-5 bg-white border border-[#141414]/8 space-y-2">
            <div className="w-9 h-9 rounded-full bg-[#A7654A]/10 flex items-center justify-center text-[#A7654A]">
              <PackageCheck className="w-4 h-4" />
            </div>
            <h4 className="font-serif text-base text-[#141414]">Safe & Secure Packaging</h4>
            <p className="text-xs text-[#73706B] font-light leading-relaxed">
              Each garment is ironed, wrapped in protective natural paper, and placed in durable boxes so it arrives in pristine condition.
            </p>
          </div>
        </div>

        {/* Delivery Rates & Timeline Table */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-1">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#A7654A] font-semibold block">
                Delivery Schedule
              </span>
              <h3 className="font-serif text-xl sm:text-2xl text-[#141414]">Estimated Delivery Timelines</h3>
            </div>
            <span className="text-xs text-[#73706B]">Dispatched Monday through Saturday</span>
          </div>

          <div className="overflow-x-auto border border-[#141414]/10 bg-white">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-[#FAF9F6] border-b border-[#141414]/10">
                <tr className="text-[#141414] uppercase tracking-wider text-[10px]">
                  <th className="p-3.5 font-semibold">Destination</th>
                  <th className="p-3.5 font-semibold">Courier Partners</th>
                  <th className="p-3.5 font-semibold">Delivery Time</th>
                  <th className="p-3.5 font-semibold">Shipping Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#141414]/8 text-[#141414]">
                <tr className="hover:bg-[#FAF9F6] transition-colors">
                  <td className="p-3.5 font-medium">Metro Cities (Mumbai, Delhi NCR, Bengaluru, Hyderabad, Chennai, Kolkata, Pune)</td>
                  <td className="p-3.5 text-[#73706B]">BlueDart / Delhivery Express</td>
                  <td className="p-3.5 tabular-nums font-medium">2 – 3 working days</td>
                  <td className="p-3.5 font-medium text-emerald-700">FREE on ₹1,999+ (or ₹150)</td>
                </tr>
                <tr className="hover:bg-[#FAF9F6] transition-colors">
                  <td className="p-3.5 font-medium">Tier 2 & Tier 3 Cities</td>
                  <td className="p-3.5 text-[#73706B]">BlueDart / DTDC Air / Delhivery</td>
                  <td className="p-3.5 tabular-nums font-medium">3 – 5 working days</td>
                  <td className="p-3.5 font-medium text-emerald-700">FREE on ₹1,999+ (or ₹150)</td>
                </tr>
                <tr className="hover:bg-[#FAF9F6] transition-colors">
                  <td className="p-3.5 font-medium">North East, Jammu & Kashmir, Remote Areas</td>
                  <td className="p-3.5 text-[#73706B]">India Post Speed Post / Delhivery</td>
                  <td className="p-3.5 tabular-nums font-medium">5 – 7 working days</td>
                  <td className="p-3.5 font-medium text-emerald-700">FREE on ₹1,999+ (or ₹150)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Dispatch Rules & FAQs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
          <div className="bg-white p-5 border border-[#141414]/8 space-y-2">
            <h4 className="font-serif text-base text-[#141414]">Order Tracking</h4>
            <p className="text-xs text-[#73706B] font-light leading-relaxed">
              As soon as your order is packed and dispatched, you will receive an SMS and WhatsApp message with your tracking link to follow your parcel in real-time.
            </p>
          </div>

          <div className="bg-white p-5 border border-[#141414]/8 space-y-2">
            <h4 className="font-serif text-base text-[#141414]">Address Changes</h4>
            <p className="text-xs text-[#73706B] font-light leading-relaxed">
              Need to modify your delivery address or contact number? Please contact us on WhatsApp at <strong>+91 7977641125</strong> within 6 hours of placing your order.
            </p>
          </div>
        </div>

        {/* Contact Banner */}
        <div className="p-6 bg-white border border-[#141414]/8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="font-serif text-base text-[#141414]">Need help with an ongoing delivery?</h4>
            <p className="text-xs text-[#73706B] font-light">
              WhatsApp or call us at +91 7977641125 / Email: priyanshubipin2006@gmail.com
            </p>
          </div>
          <Link
            to="/contact"
            className="h-12 px-8 bg-[#141414] hover:bg-black text-white text-xs uppercase tracking-widest font-semibold rounded-lg shadow-md flex items-center justify-center shrink-0 transition-all active:scale-[0.99]"
          >
            Contact Customer Support
          </Link>
        </div>
      </section>
    </div>
  );
};
