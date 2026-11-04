import React, { useState } from 'react';
import { useUIStore } from '../../store/useUIStore';
import { X, Ruler } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export const SizeGuideModal: React.FC = () => {
  const { isSizeGuideOpen, closeSizeGuide } = useUIStore();
  const [unit, setUnit] = useState<'cm' | 'in'>('cm');

  if (!isSizeGuideOpen) return null;

  const measurementsCM = [
    { size: 'XS', chest: '92 - 96', waist: '76 - 80', hip: '92 - 96', length: '72' },
    { size: 'S', chest: '96 - 102', waist: '80 - 86', hip: '96 - 102', length: '74' },
    { size: 'M', chest: '102 - 108', waist: '86 - 92', hip: '102 - 108', length: '76' },
    { size: 'L', chest: '108 - 114', waist: '92 - 98', hip: '108 - 114', length: '78' },
    { size: 'XL', chest: '114 - 122', waist: '98 - 106', hip: '114 - 122', length: '80' },
  ];

  const measurementsIN = [
    { size: 'XS', chest: '36 - 38', waist: '30 - 31.5', hip: '36 - 38', length: '28.3' },
    { size: 'S', chest: '38 - 40', waist: '31.5 - 34', hip: '38 - 40', length: '29.1' },
    { size: 'M', chest: '40 - 42.5', waist: '34 - 36', hip: '40 - 42.5', length: '29.9' },
    { size: 'L', chest: '42.5 - 45', waist: '36 - 38.5', hip: '42.5 - 45', length: '30.7' },
    { size: 'XL', chest: '45 - 48', waist: '38.5 - 41.5', hip: '45 - 48', length: '31.5' },
  ];

  const data = unit === 'cm' ? measurementsCM : measurementsIN;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          className="bg-white border border-[#141414]/15 shadow-2xl max-w-2xl w-full my-8 p-6 sm:p-7 relative"
        >
          <button
            onClick={closeSizeGuide}
            className="absolute top-5 right-5 text-[#73706B] hover:text-[#141414] transition-colors p-1"
            aria-label="Close size guide"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-[#A7654A] font-semibold mb-1">
            <Ruler className="w-3.5 h-3.5" />
            <span>Atelier Sizing Guide</span>
          </div>

          <h3 className="font-serif text-xl sm:text-2xl text-[#141414] font-normal">
            Architectural Proportions & Fit
          </h3>

          <p className="text-xs text-[#73706B] mt-1.5 font-light leading-relaxed">
            DUKAAN pieces are cut with intentional ease, dropping slightly off the shoulder to celebrate natural drape. For an editorial, relaxed silhouette, select your true size. For a more conventional fitted look, size down one step.
          </p>

          {/* Unit Toggle */}
          <div className="flex items-center justify-end mt-4 mb-2 gap-2 text-xs">
            <span className="text-[10px] uppercase tracking-wider text-[#73706B] font-medium mr-1">Units:</span>
            <div className="inline-flex p-0.5 bg-[#FAF9F6] border border-[#141414]/15 rounded-full">
              <button
                onClick={() => setUnit('cm')}
                className={`h-7 px-3.5 text-xs rounded-full tabular-nums font-semibold transition-all ${
                  unit === 'cm'
                    ? 'bg-[#141414] text-white shadow-xs'
                    : 'text-[#73706B] hover:text-[#141414]'
                }`}
              >
                Centimetres (cm)
              </button>
              <button
                onClick={() => setUnit('in')}
                className={`h-7 px-3.5 text-xs rounded-full tabular-nums font-semibold transition-all ${
                  unit === 'in'
                    ? 'bg-[#141414] text-white shadow-xs'
                    : 'text-[#73706B] hover:text-[#141414]'
                }`}
              >
                Inches (in)
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto border border-[#141414]/10 bg-white">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF9F6] border-b border-[#141414]/10">
                <tr className="uppercase tracking-wider text-[10px] text-[#141414]">
                  <th className="p-3 font-semibold">Size</th>
                  <th className="p-3 font-semibold">Chest / Bust</th>
                  <th className="p-3 font-semibold">Natural Waist</th>
                  <th className="p-3 font-semibold">Hip Width</th>
                  <th className="p-3 font-semibold">Body Length</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#141414]/8 tabular-nums text-[#141414] text-xs">
                {data.map((row) => (
                  <tr key={row.size} className="hover:bg-[#FAF9F6] transition-colors">
                    <td className="p-3 font-bold">{row.size}</td>
                    <td className="p-3 text-[#73706B]">{row.chest}</td>
                    <td className="p-3 text-[#73706B]">{row.waist}</td>
                    <td className="p-3 text-[#73706B]">{row.hip}</td>
                    <td className="p-3 text-[#73706B]">{row.length}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 p-3.5 bg-[#FAF9F6] border border-[#141414]/8 text-xs text-[#73706B] space-y-1 font-light">
            <p><strong>Unisex Sizing Reference:</strong> Size XS corresponds to Women's S / Men's XS. Size S corresponds to Women's M / Men's S. Size M corresponds to Women's L / Men's M.</p>
            <p>For custom tailoring advice, contact our concierge at <a href="tel:+917977641125" className="text-[#141414] underline tabular-nums font-medium">+91 7977641125</a>.</p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
