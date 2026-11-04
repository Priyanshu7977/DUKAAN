import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
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
    setIsSubscribed(true);
    showToast('Thank you for subscribing to Dukaan.', 'success');
  };

  return (
    <footer className="bg-[#141414] text-[#FAF9F6] pt-16 pb-10 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Newsletter & Brand Statement */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-12 border-b border-white/10">
          <div className="lg:col-span-6 space-y-3">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#A7654A] font-semibold block">
              Stay in Touch
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-white font-normal leading-snug">
              Get updates on new clothing releases, styling tips & exclusive offers.
            </h2>
            <p className="text-xs text-[#8A8780] max-w-md font-light leading-relaxed">
              We send thoughtful updates on breathable linen clothes, relaxed co-ords, and special early-access discounts across India.
            </p>
          </div>

          <div className="lg:col-span-6 flex flex-col justify-end">
            {!isSubscribed ? (
              <form onSubmit={handleSubscribe} className="relative">
                <div className="flex border-b border-white/20 focus-within:border-white transition-colors pb-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full bg-transparent text-xs sm:text-sm text-white placeholder:text-white/40 focus:outline-none"
                    required
                  />
                  <button
                    type="submit"
                    className="px-4 py-1 text-xs uppercase tracking-widest text-white hover:text-[#A7654A] transition-colors flex items-center gap-1 shrink-0 font-medium"
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
              <div className="p-3 bg-white/5 border border-white/10 flex items-center gap-2.5 text-xs text-white">
                <Check className="w-4 h-4 text-[#A7654A]" />
                <span>You have been added to the Private Atelier registry.</span>
              </div>
            )}
          </div>
        </div>

        {/* Links Navigation Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 py-12 border-b border-white/10 text-xs">
          {/* Col 1: Brand Wordmark & Client Care Contacts */}
          <div className="col-span-2 md:col-span-4 lg:col-span-2 space-y-3.5 pr-6">
            <span className="font-serif text-2xl tracking-[0.25em] uppercase text-white block font-medium">
              DUKAAN
            </span>
            <p className="text-xs text-[#8A8780] max-w-xs font-light leading-relaxed">
              Objects of everyday expression. Contemporary unisex clothing crafted with pure organic linen, breathable cotton, and timeless silhouettes.
            </p>
            <div className="pt-2 text-[11px] text-[#8A8780] space-y-1">
              <p className="text-white/90 font-medium">Concierge & Client Care:</p>
              <p>
                Mobile / WhatsApp:{' '}
                <a href="tel:+917977641125" className="text-white hover:text-[#A7654A] font-mono transition-colors">
                  +91 7977641125
                </a>
              </p>
              <p>
                Email:{' '}
                <a href="mailto:priyanshubipin2006@gmail.com" className="text-white hover:text-[#A7654A] font-mono transition-colors">
                  priyanshubipin2006@gmail.com
                </a>
              </p>
            </div>
            <div className="pt-1 text-[10px] text-[#8A8780]/80">
              <p>Mumbai Design Atelier • Nationwide Express Delivery to 19,000+ PIN Codes across India</p>
            </div>
          </div>

          {/* Col 2: Wardrobe Categories */}
          <div className="space-y-2.5">
            <span className="uppercase tracking-widest text-[11px] font-medium text-white/50 block">
              Wardrobe
            </span>
            <ul className="space-y-1.5 text-[#8A8780]">
              <li><Link to="/shop" className="hover:text-white transition-colors">All Objects</Link></li>
              <li><Link to="/men" className="hover:text-white transition-colors">Men's Edit</Link></li>
              <li><Link to="/women" className="hover:text-white transition-colors">Women's Edit</Link></li>
              <li><Link to="/shop?category=shirts" className="hover:text-white transition-colors">Linen Shirts</Link></li>
              <li><Link to="/shop?category=trousers" className="hover:text-white transition-colors">Pleated Trousers</Link></li>
              <li><Link to="/shop?category=co-ords" className="hover:text-white transition-colors">Co-Ord Sets</Link></li>
            </ul>
          </div>

          {/* Col 3: Collections */}
          <div className="space-y-2.5">
            <span className="uppercase tracking-widest text-[11px] font-medium text-white/50 block">
              Collections
            </span>
            <ul className="space-y-1.5 text-[#8A8780]">
              <li><Link to="/collections/solstice-atelier" className="hover:text-white transition-colors">Solstice Atelier</Link></li>
              <li><Link to="/collections/terra-monochrome" className="hover:text-white transition-colors">Terra Monochrome</Link></li>
              <li><Link to="/collections/transitional-wardrobe" className="hover:text-white transition-colors">Transitional Edit</Link></li>
              <li><Link to="/journal" className="hover:text-white transition-colors">Editorial Journal</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">Atelier Philosophy</Link></li>
            </ul>
          </div>

          {/* Col 4: Assistance */}
          <div className="space-y-2.5">
            <span className="uppercase tracking-widest text-[11px] font-medium text-white/50 block">
              Client Care
            </span>
            <ul className="space-y-1.5 text-[#8A8780]">
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Concierge</Link></li>
              <li><Link to="/shipping" className="hover:text-white transition-colors">Worldwide Courier</Link></li>
              <li><Link to="/returns" className="hover:text-white transition-colors">Returns & Exchanges</Link></li>
              <li><Link to="/faq" className="hover:text-white transition-colors">Client FAQs</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#8A8780] gap-3">
          <p>© {new Date().getFullYear()} FORME ATELIER. All rights reserved. Master Atelier Edition.</p>
          <div className="flex items-center space-x-5 uppercase tracking-wider text-[10px]">
            <span>Instagram</span>
            <span>Substack</span>
            <span>Archive</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
