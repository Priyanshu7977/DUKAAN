import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Phone, Mail, ShieldCheck, Truck, RotateCcw, Sparkles } from 'lucide-react';
import { useUIStore } from '../../store/useUIStore';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const showToast = useUIStore((state) => state.showToast);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      showToast('Please enter a valid email address', 'error');
      return;
    }
    const targetEmail = email.trim();
    setIsSubscribed(true);
    showToast('Thank you for subscribing to DUKAAN.', 'success');

    fetch('/api/notifications/welcome', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: targetEmail }),
    }).catch(() => {});
  };

  return (
    <footer className="w-full px-3 sm:px-6 pt-6 pb-6 sm:pb-8 select-none">
      <div className="max-w-6xl mx-auto bg-[#141414] text-[#FAF9F6] rounded-2xl sm:rounded-3xl p-5 sm:p-10 lg:p-12 border border-white/10 shadow-2xl overflow-hidden">
        
        {/* Newsletter Subscription Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 pb-8 sm:pb-10 border-b border-white/10">
          <div className="lg:col-span-7 space-y-2">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#A7654A] font-semibold block">
              Stay in Touch
            </span>
            <h2 className="font-serif text-xl sm:text-2xl lg:text-3xl text-white font-normal leading-snug">
              Get updates on new clothing releases, styling tips & exclusive offers.
            </h2>
            <p className="text-xs text-[#8A8780] max-w-lg font-light leading-relaxed">
              We send thoughtful updates on breathable linen clothes, relaxed co-ords, and special early-access discounts across India.
            </p>
          </div>

          <div className="lg:col-span-5 flex flex-col justify-end pt-2 lg:pt-0">
            {!isSubscribed ? (
              <form onSubmit={handleSubscribe} className="relative w-full">
                <div className="flex items-center border-b border-white/20 focus-within:border-white transition-colors pb-2 gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="flex-1 min-w-0 bg-transparent text-xs sm:text-sm text-white placeholder:text-white/40 focus:outline-none"
                    required
                  />
                  <button
                    type="submit"
                    className="px-3 sm:px-4 py-1.5 text-[11px] sm:text-xs uppercase tracking-widest text-white bg-white/10 hover:bg-[#A7654A] hover:text-white transition-all rounded-md flex items-center gap-1.5 shrink-0 font-medium active:scale-95"
                  >
                    <span>Subscribe</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <span className="text-[10px] text-white/40 mt-1.5 block">
                  By subscribing, you agree to our Privacy Policy and consent to receive updates.
                </span>
              </form>
            ) : (
              <div className="p-3 bg-white/5 border border-white/10 flex items-center gap-2.5 text-xs text-white rounded-lg">
                <Check className="w-4 h-4 text-[#A7654A]" />
                <span>You have been added to the Private DUKAAN Atelier registry.</span>
              </div>
            )}
          </div>
        </div>

        {/* Links Navigation Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 sm:gap-8 py-8 sm:py-10 border-b border-white/10 text-xs">
          
          {/* Brand Manifesto & Concierge Contacts */}
          <div className="col-span-2 md:col-span-4 lg:col-span-2 space-y-3 sm:pr-4">
            <span className="font-serif text-xl sm:text-2xl tracking-[0.25em] uppercase text-white block font-medium">
              DUKAAN
            </span>
            <p className="text-xs text-[#8A8780] max-w-sm font-light leading-relaxed">
              Objects of everyday expression. Contemporary unisex clothing crafted with pure organic linen, breathable cotton, and timeless silhouettes.
            </p>

            <div className="pt-2 text-[11px] text-[#8A8780] space-y-1.5 bg-white/5 p-3.5 rounded-xl border border-white/8">
              <p className="text-white font-medium flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#A7654A]" />
                <span>Concierge & Client Care</span>
              </p>
              <p className="flex items-center gap-2 pt-0.5">
                <Phone className="w-3.5 h-3.5 text-[#A7654A] shrink-0" />
                <span>WhatsApp:</span>
                <a
                  href="https://wa.me/917977641125"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-[#A7654A] tabular-nums font-semibold transition-colors underline"
                >
                  +91 7977641125
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#A7654A] shrink-0" />
                <span>Email:</span>
                <a
                  href="mailto:priyanshubipin2006@gmail.com"
                  className="text-white hover:text-[#A7654A] font-medium transition-colors break-all"
                >
                  priyanshubipin2006@gmail.com
                </a>
              </p>
            </div>

            <div className="pt-0.5 text-[10px] text-[#8A8780]/80">
              <p>Mumbai Design Atelier • Nationwide Express Delivery to 19,000+ PIN Codes across India</p>
            </div>
          </div>

          {/* Col 2: Wardrobe */}
          <div className="space-y-2.5">
            <span className="uppercase tracking-widest text-[10px] sm:text-[11px] font-semibold text-white/70 block">
              Wardrobe
            </span>
            <ul className="space-y-2 text-[#8A8780]">
              <li><Link to="/shop" className="hover:text-white transition-colors block py-0.5">All Objects</Link></li>
              <li><Link to="/men" className="hover:text-white transition-colors block py-0.5">Men's Edit</Link></li>
              <li><Link to="/women" className="hover:text-white transition-colors block py-0.5">Women's Edit</Link></li>
              <li><Link to="/shop?category=shirts" className="hover:text-white transition-colors block py-0.5">Linen Shirts</Link></li>
              <li><Link to="/shop?category=trousers" className="hover:text-white transition-colors block py-0.5">Pleated Trousers</Link></li>
              <li><Link to="/shop?category=co-ords" className="hover:text-white transition-colors block py-0.5">Co-Ord Sets</Link></li>
            </ul>
          </div>

          {/* Col 3: Collections */}
          <div className="space-y-2.5">
            <span className="uppercase tracking-widest text-[10px] sm:text-[11px] font-semibold text-white/70 block">
              Collections
            </span>
            <ul className="space-y-2 text-[#8A8780]">
              <li><Link to="/collections/solstice-atelier" className="hover:text-white transition-colors block py-0.5">Solstice Atelier</Link></li>
              <li><Link to="/collections/terra-monochrome" className="hover:text-white transition-colors block py-0.5">Terra Monochrome</Link></li>
              <li><Link to="/collections/transitional-wardrobe" className="hover:text-white transition-colors block py-0.5">Transitional Edit</Link></li>
              <li><Link to="/journal" className="hover:text-white transition-colors block py-0.5">Editorial Journal</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors block py-0.5">Atelier Philosophy</Link></li>
              <li><Link to="/search" className="hover:text-white transition-colors block py-0.5">Search Archive</Link></li>
            </ul>
          </div>

          {/* Col 4: Client Care */}
          <div className="space-y-2.5">
            <span className="uppercase tracking-widest text-[10px] sm:text-[11px] font-semibold text-white/70 block">
              Client Care
            </span>
            <ul className="space-y-2 text-[#8A8780]">
              <li><Link to="/contact" className="hover:text-white transition-colors block py-0.5">Contact Concierge</Link></li>
              <li><Link to="/shipping" className="hover:text-white transition-colors block py-0.5">Delivery & Tracking</Link></li>
              <li><Link to="/returns" className="hover:text-white transition-colors block py-0.5">Returns & Exchanges</Link></li>
              <li><Link to="/faq" className="hover:text-white transition-colors block py-0.5">Client FAQs</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition-colors block py-0.5">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors block py-0.5">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Col 5: Atelier Service Badges (Balances Mobile 2-Col Grid) */}
          <div className="space-y-2.5">
            <span className="uppercase tracking-widest text-[10px] sm:text-[11px] font-semibold text-white/70 block">
              Atelier Promise
            </span>
            <div className="space-y-2 text-[11px] text-[#8A8780]">
              <div className="flex items-center gap-2">
                <Truck className="w-3.5 h-3.5 text-[#A7654A] shrink-0" />
                <span>Free Express Air Delivery over ₹1,999</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-3.5 h-3.5 text-[#A7654A] shrink-0" />
                <span>7-Day Doorstep Size Exchange</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-[#A7654A] shrink-0" />
                <span>Cash on Delivery & Secure UPI</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[#A7654A] shrink-0" />
                <span>100% Pure Normandy Flax Linen</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Badges */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#8A8780] gap-3 text-center sm:text-left">
          <p>© {new Date().getFullYear()} DUKAAN. All rights reserved. Handcrafted for India & Worldwide.</p>
          <div className="flex items-center justify-center space-x-6 uppercase tracking-wider text-[10px]">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Instagram</a>
            <a href="https://wa.me/917977641125" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">WhatsApp</a>
            <Link to="/journal" className="hover:text-white transition-colors">Journal</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};
