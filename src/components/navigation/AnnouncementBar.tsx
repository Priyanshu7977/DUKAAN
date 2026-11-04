import React from 'react';
import { X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUIStore } from '../../store/useUIStore';

export const AnnouncementBar: React.FC = () => {
  const { isAnnouncementVisible, dismissAnnouncement } = useUIStore();

  if (!isAnnouncementVisible) return null;

  return (
    <div className="bg-[#141414] text-[#FAF9F6] text-[11px] uppercase tracking-[0.18em] py-2 px-4 transition-all duration-300 relative border-b border-white/10 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex-1 text-center font-normal">
          <span>Free Delivery Across India on Orders Above ₹1,999</span>
          <span className="hidden md:inline mx-3 text-[#A7654A]">•</span>
          <span className="hidden md:inline text-white/80">Cash on Delivery & 7-Day Doorstep Returns Available</span>
          <span className="hidden lg:inline mx-3 text-[#A7654A]">•</span>
          <Link
            to="/shop"
            className="hidden lg:inline underline hover:text-[#A7654A] transition-colors ml-1 font-medium"
          >
            Explore New Collection
          </Link>
        </div>
        <button
          onClick={dismissAnnouncement}
          aria-label="Dismiss banner"
          className="text-white/60 hover:text-white transition-colors shrink-0 ml-2 p-0.5"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
