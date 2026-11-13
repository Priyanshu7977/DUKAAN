import React, { useState } from 'react';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { useUIStore } from '../store/useUIStore';
import { Mail, Phone, Check, ArrowRight, MessageSquare, Clock } from 'lucide-react';

export const Contact: React.FC = () => {
  const showToast = useUIStore((state) => state.showToast);

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    inquiryType: 'Order & Delivery Status',
    subject: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleNameChange = (val: string) => {
    setForm((prev) => ({ ...prev, name: val.replace(/[^a-zA-Z\s]/g, '') }));
  };

  const handlePhoneChange = (val: string) => {
    setForm((prev) => ({ ...prev, phone: val.replace(/\D/g, '').slice(0, 10) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      showToast('Please fill in all required fields.', 'error');
      return;
    }

    if (form.phone && form.phone.length !== 10) {
      showToast('Please enter a valid 10-digit mobile number.', 'error');
      return;
    }

    setIsSubmitting(true);

    fetch('/api/notifications/inquiry-acknowledgment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        subject: form.subject || form.inquiryType,
        message: form.message,
      }),
    }).catch(() => {});

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      showToast('Your message has been sent. We will get back to you shortly!', 'success');
    }, 800);
  };

  return (
    <div className="w-full pb-12 bg-[#FAF9F6]">
      <section className="pt-6 sm:pt-8 pb-6 sm:pb-8 bg-[#FAF8F5] border-b border-[#141414]/8 mb-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: 'Help & Contact' }]} className="mb-2" />
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#A7654A] font-semibold block mb-0.5">
            Customer Support
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#141414] font-normal tracking-tight leading-tight">
            Contact Us
          </h1>
          <p className="text-xs sm:text-sm text-[#73706B] max-w-xl font-light mt-1 leading-relaxed">
            Have questions about sizes, your order, or delivery? Reach out to us directly via phone, WhatsApp, or email.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          <div className="lg:col-span-7">
            <h2 className="sr-only">Send an Inquiry Message</h2>
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-4 bg-[#FAF8F5] p-6 sm:p-8 border border-[#141414]/8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#73706B] font-medium mb-1">
                      Full Name (Letters only) *
                    </label>
                    <input
                      type="text"
                      required
                      id="contact-fullname"
                      name="name"
                      value={form.name}
                      onChange={(e) => handleNameChange(e.target.value)}
                      placeholder="Enter full name"
                      className="w-full bg-[#FAF9F6] border border-[#141414]/15 rounded-lg px-3.5 py-2.5 text-xs text-[#141414] focus:outline-none focus:border-[#141414] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#73706B] font-medium mb-1">
                      Mobile Number (Numbers only)
                    </label>
                    <div className="flex rounded-lg overflow-hidden border border-[#141414]/15 focus-within:border-[#141414] bg-[#FAF9F6]">
                      <span className="inline-flex items-center px-3 bg-[#EAE7DF] border-r border-[#141414]/10 text-xs text-[#73706B] font-medium tabular-nums select-none">
                        +91
                      </span>
                      <input
                        type="tel"
                        id="contact-phone"
                        name="phone"
                        value={form.phone}
                        onChange={(e) => handlePhoneChange(e.target.value)}
                        placeholder="10-digit number"
                        className="w-full bg-transparent px-3 py-2.5 text-xs text-[#141414] focus:outline-none font-medium tabular-nums"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#73706B] font-medium mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      id="contact-email"
                      name="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="Enter email address"
                      className="w-full bg-[#FAF9F6] border border-[#141414]/15 rounded-lg px-3.5 py-2.5 text-xs text-[#141414] focus:outline-none focus:border-[#141414] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#73706B] font-medium mb-1">
                      How can we help you?
                    </label>
                    <select
                      id="contact-inquiry-type"
                      name="inquiryType"
                      value={form.inquiryType}
                      onChange={(e) => setForm({ ...form, inquiryType: e.target.value })}
                      className="w-full bg-[#FAF9F6] border border-[#141414]/15 rounded-lg px-3.5 py-2.5 text-xs text-[#141414] focus:outline-none focus:border-[#141414] transition-colors"
                    >
                      <option value="Order & Delivery Status">Order & Delivery Status</option>
                      <option value="Size & Fit Consultation">Size & Fit Guidance</option>
                      <option value="Exchange or Return">Exchange or Return Request</option>
                      <option value="Fabric & Care Instructions">Fabric & Care Details</option>
                      <option value="Custom / Bulk Order">Custom or Bulk Inquiries</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#73706B] font-medium mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="contact-subject"
                    name="subject"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    placeholder="Enter message subject"
                    className="w-full bg-[#FAF9F6] border border-[#141414]/15 rounded-lg px-3.5 py-2.5 text-xs text-[#141414] focus:outline-none focus:border-[#141414] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#73706B] font-medium mb-1">
                    Your Message *
                  </label>
                  <textarea
                    required
                    rows={4}
                    id="contact-message"
                    name="message"
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Write your message here..."
                    className="w-full bg-[#FAF9F6] border border-[#141414]/15 rounded-lg px-3.5 py-2.5 text-xs text-[#141414] focus:outline-none focus:border-[#141414] transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 bg-[#141414] hover:bg-black text-white text-xs uppercase tracking-[0.2em] font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50 rounded-lg shadow-md active:scale-[0.99]"
                >
                  {isSubmitting ? (
                    <span>Sending Message...</span>
                  ) : (
                    <>
                      <span>Send Message</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              <div className="bg-white p-8 border border-[#141414]/8 text-center space-y-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-800">
                  <Check className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-2xl text-[#141414]">Message Sent Successfully!</h3>
                <p className="text-xs text-[#73706B] max-w-sm mx-auto font-light leading-relaxed">
                  Thank you for writing to us. Our customer support team will review your message and reply via WhatsApp or email within a few hours.
                </p>
                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setForm({
                      name: '',
                      phone: '',
                      email: '',
                      inquiryType: 'Order & Delivery Status',
                      subject: '',
                      message: '',
                    });
                  }}
                  className="px-6 py-2 bg-[#141414] text-white text-[11px] uppercase tracking-widest font-medium"
                >
                  Send Another Message
                </button>
              </div>
            )}
          </div>

          <div className="lg:col-span-5 space-y-5">
            <h2 className="sr-only">Direct Store Contact Details</h2>
            <div className="bg-white p-6 border border-[#141414]/8 space-y-3">
              <div className="flex items-center gap-2.5 text-[#141414]">
                <Phone className="w-4 h-4 text-[#A7654A]" />
                <h3 className="font-serif text-base font-normal">Phone & WhatsApp Support</h3>
              </div>
              <p className="text-xs text-[#73706B] font-light">
                Available all 7 days from 10:00 AM to 8:00 PM IST for quick help with orders and sizing.
              </p>
              <div className="pt-1">
                <a
                  href="tel:+917977641125"
                  className="text-sm text-[#141414] hover:text-[#A7654A] font-semibold tabular-nums transition-colors block"
                >
                  +91 7977641125
                </a>
                <a
                  href="https://wa.me/917977641125"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-emerald-700 underline font-medium hover:text-emerald-800 transition-colors inline-block mt-1"
                >
                  Chat with us on WhatsApp →
                </a>
              </div>
            </div>

            <div className="bg-white p-6 border border-[#141414]/8 space-y-3">
              <div className="flex items-center gap-2.5 text-[#141414]">
                <Mail className="w-4 h-4 text-[#A7654A]" />
                <h3 className="font-serif text-base font-normal">Direct Email</h3>
              </div>
              <p className="text-xs text-[#73706B] font-light">
                For order updates, bulk purchases, collaborations, or general questions:
              </p>
              <div className="pt-1">
                <a
                  href="mailto:priyanshubipin2006@gmail.com"
                  className="text-sm text-[#141414] hover:text-[#A7654A] font-medium transition-colors block"
                >
                  priyanshubipin2006@gmail.com
                </a>
              </div>
            </div>

            <div className="bg-[#FAF9F6] p-5 border border-[#141414]/10 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-[#141414] font-medium">
                <Clock className="w-4 h-4 text-[#A7654A]" />
                <span>Fast Delivery & Easy Returns</span>
              </div>
              <p className="text-[#73706B] font-light leading-relaxed">
                Orders are dispatched within 24 to 48 hours. We offer free delivery on orders above ₹1,999 and simple 7-day doorstep size exchanges.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
