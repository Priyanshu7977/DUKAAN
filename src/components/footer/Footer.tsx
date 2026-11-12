import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Phone, Mail, ShieldCheck, Truck, RotateCcw, Sparkles, ArrowUp } from 'lucide-react';
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

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-[#141414] text-[#FAF9F6] border-t border-white/10 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="py-3 sm:py-4 border-b border-white/10 grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4 text-[10px] sm:text-[11px] text-[#A6A39C]">
          <div className="flex items-center gap-2 min-h-[34px] sm:min-h-0">
            <Truck className="w-3.5 h-3.5 text-[#A7654A] shrink-0" />
            <span className="leading-tight">Free Express Air on ₹1,999+</span>
          </div>
          <div className="flex items-center gap-2 min-h-[34px] sm:min-h-0">
            <RotateCcw className="w-3.5 h-3.5 text-[#A7654A] shrink-0" />
            <span className="leading-tight">7-Day Doorstep Size Exchange</span>
          </div>
          <div className="flex items-center gap-2 min-h-[34px] sm:min-h-0">
            <ShieldCheck className="w-3.5 h-3.5 text-[#A7654A] shrink-0" />
            <span className="leading-tight">Cash on Delivery & Secure UPI</span>
          </div>
          <div className="flex items-center gap-2 min-h-[34px] sm:min-h-0">
            <Sparkles className="w-3.5 h-3.5 text-[#A7654A] shrink-0" />
            <span className="leading-tight">100% Pure Normandy Flax Linen</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 sm:gap-8 py-6 sm:py-8 text-xs border-b border-white/10">
          
          <div className="col-span-2 md:col-span-1 space-y-3">
            <Link to="/" className="inline-block">
              <span className="font-serif text-xl sm:text-2xl tracking-[0.25em] uppercase text-white font-medium">
                DUKAAN
              </span>
            </Link>
            <p className="text-[11px] text-[#8A8780] font-light leading-relaxed max-w-xs">
              Objects of everyday expression. Relaxed silhouettes crafted with pure organic linen and breathable cotton gauze.
            </p>
            <div className="pt-1 text-[11px] text-[#8A8780] space-y-1">
              <a
                href="https://wa.me/917977641125"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 hover:text-white transition-colors"
              >
                <Phone className="w-3 h-3 text-[#A7654A]" />
                <span className="tabular-nums font-medium">+91 7977641125</span>
              </a>
              <a
                href="mailto:priyanshubipin2006@gmail.com"
                className="flex items-center gap-1.5 hover:text-white transition-colors break-all"
              >
                <Mail className="w-3 h-3 text-[#A7654A]" />
                <span>priyanshubipin2006@gmail.com</span>
              </a>
            </div>
          </div>

          <div className="space-y-2">
            <span className="uppercase tracking-[0.2em] text-[10px] font-semibold text-white/70 block">
              Wardrobe
            </span>
            <ul className="space-y-1.5 text-[11px] text-[#8A8780]">
              <li><Link to="/shop" className="hover:text-white transition-colors block py-0.5">All Objects</Link></li>
              <li><Link to="/men" className="hover:text-white transition-colors block py-0.5">Men's Edit</Link></li>
              <li><Link to="/women" className="hover:text-white transition-colors block py-0.5">Women's Edit</Link></li>
              <li><Link to="/shop?category=shirts" className="hover:text-white transition-colors block py-0.5">Linen Shirts</Link></li>
              <li><Link to="/shop?category=trousers" className="hover:text-white transition-colors block py-0.5">Pleated Trousers</Link></li>
              <li><Link to="/shop?category=co-ords" className="hover:text-white transition-colors block py-0.5">Co-Ord Sets</Link></li>
            </ul>
          </div>

          <div className="space-y-2">
            <span className="uppercase tracking-[0.2em] text-[10px] font-semibold text-white/70 block">
              Client Care
            </span>
            <ul className="space-y-1.5 text-[11px] text-[#8A8780]">
              <li><Link to="/track" className="hover:text-white transition-colors block py-0.5 font-medium text-white/95">Track Order</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors block py-0.5">Contact Concierge</Link></li>
              <li><Link to="/shipping" className="hover:text-white transition-colors block py-0.5">Shipping Policy</Link></li>
              <li><Link to="/returns" className="hover:text-white transition-colors block py-0.5">Returns & Exchanges</Link></li>
              <li><Link to="/faq" className="hover:text-white transition-colors block py-0.5">Client FAQs</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors block py-0.5">Brand Philosophy</Link></li>
              <li><Link to="/blog" className="hover:text-white transition-colors block py-0.5">Editorial Blog</Link></li>
            </ul>
          </div>

          <div className="col-span-2 md:col-span-1 space-y-2.5">
            <span className="uppercase tracking-[0.2em] text-[10px] font-semibold text-white/70 block">
              Newsletter
            </span>
            <p className="text-[11px] text-[#8A8780] font-light leading-relaxed">
              Thoughtful updates on seasonal capsule drops and private events.
            </p>

            {!isSubscribed ? (
              <form onSubmit={handleSubscribe} className="space-y-1.5 pt-1">
                <div className="flex items-center border-b border-white/20 focus-within:border-white transition-colors pb-1.5 gap-2">
                  <input
                    type="email"
                    id="footer-newsletter-email"
                    name="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email address"
                    className="flex-1 min-w-0 bg-transparent text-[11px] text-white placeholder:text-white/40 focus:outline-none"
                    required
                  />
                  <button
                    type="submit"
                    className="p-1 text-white/70 hover:text-white transition-colors"
                    aria-label="Subscribe to newsletter"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            ) : (
              <div className="p-2 bg-white/5 border border-white/10 flex items-center gap-2 text-[11px] text-emerald-400 rounded-md">
                <Check className="w-3.5 h-3.5" />
                <span>Joined DUKAAN registry.</span>
              </div>
            )}

            <div className="pt-2 flex items-center space-x-4 text-[10px] uppercase tracking-wider text-[#8A8780]">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Instagram</a>
              <a href="https://wa.me/917977641125" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">WhatsApp</a>
              <Link to="/journal" className="hover:text-white transition-colors">Journal</Link>
              <Link to="/blog" className="hover:text-white transition-colors">Blog</Link>
            </div>
          </div>

        </div>

        <div className="py-4 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#73706B] gap-2 text-center sm:text-left">
          <p>© {new Date().getFullYear()} DUKAAN. All rights reserved. Handcrafted for India & Worldwide.</p>
          <div className="flex items-center gap-4 text-[10px] uppercase tracking-wider">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <span>•</span>
            <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
            <span>•</span>
            <button
              onClick={scrollToTop}
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3 h-3" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
