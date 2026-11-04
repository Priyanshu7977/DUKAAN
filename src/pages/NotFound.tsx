import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center py-12 px-4 sm:px-6 bg-[#FAF9F6]">
      <div className="max-w-xl w-full text-center space-y-4">
        <span className="text-xs uppercase tracking-[0.3em] text-[#A7654A] font-semibold block">
          404 • Coordinate Untracked
        </span>

        <h1 className="font-serif text-4xl sm:text-6xl text-[#141414] font-normal">
          Page Not Located
        </h1>

        <p className="text-xs sm:text-sm text-[#73706B] font-light max-w-md mx-auto leading-relaxed">
          The archive or garment path you have requested does not exist or has been retired to our permanent private library.
        </p>

        <div className="pt-2 flex flex-wrap justify-center gap-3">
          <Link
            to="/shop"
            className="h-12 px-8 bg-[#141414] hover:bg-black text-white text-xs uppercase tracking-widest font-semibold transition-all rounded-lg shadow-md flex items-center justify-center gap-2 active:scale-[0.99]"
          >
            <span>Return to Wardrobe</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            to="/"
            className="h-12 px-8 border border-[#141414]/20 hover:border-[#141414] hover:bg-white text-[#141414] text-xs uppercase tracking-widest font-semibold transition-all rounded-lg flex items-center justify-center active:scale-[0.99]"
          >
            Atelier Home
          </Link>
        </div>

        {/* Curated quick links */}
        <div className="pt-8 border-t border-[#141414]/10 text-xs">
          <span className="text-[#73706B] uppercase tracking-wider block mb-2 text-[11px]">
            Recommended Navigation
          </span>
          <div className="flex justify-center gap-5 text-[#141414] font-medium text-[11px] uppercase tracking-wider">
            <Link to="/collections/solstice-atelier" className="hover:text-[#A7654A] underline">
              Solstice Atelier
            </Link>
            <Link to="/men" className="hover:text-[#A7654A] underline">
              Men's Edit
            </Link>
            <Link to="/women" className="hover:text-[#A7654A] underline">
              Women's Edit
            </Link>
            <Link to="/journal" className="hover:text-[#A7654A] underline">
              Journal
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
