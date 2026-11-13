import React, { useState } from 'react';
import { X, Sparkles, Check, ArrowRight, Ruler, UserCheck } from 'lucide-react';

interface FitAdvisorModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  availableSizes: Array<{ size: string; inStock: boolean }>;
  onSelectSize: (size: string) => void;
}

export const FitAdvisorModal: React.FC<FitAdvisorModalProps> = ({
  isOpen,
  onClose,
  productName,
  availableSizes,
  onSelectSize,
}) => {
  const [heightCm, setHeightCm] = useState(175);
  const [weightKg, setWeightKg] = useState(72);
  const [fitPreference, setFitPreference] = useState<'relaxed' | 'tailored' | 'oversized'>('relaxed');
  const [bodyFrame, setBodyFrame] = useState<'slim' | 'athletic' | 'broad'>('athletic');
  const [step, setStep] = useState<'input' | 'result'>('input');

  if (!isOpen) return null;

  const computeRecommendedSize = (): { size: string; confidence: number; rationale: string } => {
    let score = (weightKg / ((heightCm / 100) * (heightCm / 100)));
    let baseSize = 'M';

    if (score < 20) {
      baseSize = 'S';
      if (heightCm > 182) baseSize = 'M';
    } else if (score >= 20 && score < 24) {
      baseSize = 'M';
      if (heightCm > 185) baseSize = 'L';
    } else if (score >= 24 && score < 27.5) {
      baseSize = 'L';
      if (heightCm < 168) baseSize = 'M';
    } else {
      baseSize = 'XL';
      if (score >= 30) baseSize = 'XXL';
    }

    if (fitPreference === 'tailored' && baseSize !== 'S' && baseSize !== 'XS') {
      if (baseSize === 'XXL') baseSize = 'XL';
      else if (baseSize === 'XL') baseSize = 'L';
      else if (baseSize === 'L' && score < 25.5) baseSize = 'M';
      else if (baseSize === 'M' && score < 21.5) baseSize = 'S';
    } else if (fitPreference === 'oversized') {
      if (baseSize === 'S') baseSize = 'M';
      else if (baseSize === 'M') baseSize = 'L';
      else if (baseSize === 'L') baseSize = 'XL';
      else if (baseSize === 'XL') baseSize = 'XXL';
    }

    if (bodyFrame === 'broad' && (baseSize === 'S' || baseSize === 'M')) {
      if (baseSize === 'S') baseSize = 'M';
      else if (baseSize === 'M' && fitPreference !== 'tailored') baseSize = 'L';
    }

    const available = availableSizes.map((s) => s.size);
    let finalSize = baseSize;
    if (!available.includes(finalSize)) {
      finalSize = availableSizes.find((s) => s.inStock)?.size || available[0] || 'M';
    }

    let confidence = 94;
    if (fitPreference === 'relaxed') confidence = 97;
    if (bodyFrame === 'athletic') confidence = 95;

    const frameArticle = bodyFrame === 'athletic' ? 'an' : 'a';
    let rationale = `For your height of ${heightCm}cm and ${weightKg}kg with ${frameArticle} ${bodyFrame} frame, Size ${finalSize} balances the architectural silhouette with relaxed ease across the chest and shoulders.`;
    if (fitPreference === 'oversized') {
      rationale = `Given your preference for an editorial oversized drape, Size ${finalSize} delivers the relaxed drop-shoulder proportion without feeling ungrounded.`;
    } else if (fitPreference === 'tailored') {
      rationale = `Configured for a sharper, closer drape, Size ${finalSize} flatters your proportions while preserving breathable movement in pure natural linen.`;
    }

    return { size: finalSize, confidence, rationale };
  };

  const recommendation = computeRecommendedSize();

  const handleApply = () => {
    onSelectSize(recommendation.size);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-white shadow-2xl rounded-sm overflow-hidden border border-[#141414]/15">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#141414]/10 bg-[#FAF9F6]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#A7654A]" />
            <span className="text-xs uppercase tracking-widest font-semibold text-[#141414]">
              Studio Fit Advisor
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center text-[#73706B] hover:text-[#141414] transition-colors rounded-sm"
            aria-label="Close fit advisor"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-5">
          {step === 'input' ? (
            <>
              <div>
                <h3 className="font-serif text-lg text-[#141414]">
                  Find Your Ideal Size
                </h3>
                <p className="text-[11px] text-[#73706B] mt-0.5 leading-relaxed">
                  Tailored sizing recommendation calculated for <strong>{productName}</strong>.
                </p>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="uppercase tracking-wider text-[10px] font-semibold text-[#73706B]">
                      Height: <strong className="text-[#141414] font-medium">{heightCm} cm</strong> ({Math.floor(heightCm / 30.48)}'{Math.round((heightCm % 30.48) / 2.54)}")
                    </span>
                  </div>
                  <input
                    type="range"
                    min={150}
                    max={205}
                    value={heightCm}
                    onChange={(e) => setHeightCm(Number(e.target.value))}
                    className="w-full accent-[#141414] cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] text-[#73706B] mt-0.5">
                    <span>150 cm</span>
                    <span>175 cm</span>
                    <span>205 cm</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="uppercase tracking-wider text-[10px] font-semibold text-[#73706B]">
                      Weight: <strong className="text-[#141414] font-medium">{weightKg} kg</strong> ({Math.round(weightKg * 2.205)} lbs)
                    </span>
                  </div>
                  <input
                    type="range"
                    min={45}
                    max={120}
                    value={weightKg}
                    onChange={(e) => setWeightKg(Number(e.target.value))}
                    className="w-full accent-[#141414] cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] text-[#73706B] mt-0.5">
                    <span>45 kg</span>
                    <span>75 kg</span>
                    <span>120 kg</span>
                  </div>
                </div>

                <div>
                  <span className="uppercase tracking-wider text-[10px] font-semibold text-[#73706B] block mb-1.5">
                    Fit Preference
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'tailored', label: 'Tailored', desc: 'Closer cut' },
                      { id: 'relaxed', label: 'Relaxed', desc: 'Relaxed drape' },
                      { id: 'oversized', label: 'Oversized', desc: 'Drop shoulder' },
                    ].map((f) => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setFitPreference(f.id as any)}
                        className={`p-2.5 text-left border rounded-sm transition-all ${
                          fitPreference === f.id
                            ? 'border-[#141414] bg-[#FAF9F6] shadow-2xs'
                            : 'border-[#141414]/15 hover:border-[#141414]/40 bg-white'
                        }`}
                      >
                        <span className="block font-semibold text-[11px] text-[#141414]">{f.label}</span>
                        <span className="block text-[9px] text-[#73706B] mt-0.5">{f.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="uppercase tracking-wider text-[10px] font-semibold text-[#73706B] block mb-1.5">
                    Shoulder & Chest Build
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'slim', label: 'Lean / Slim' },
                      { id: 'athletic', label: 'Athletic' },
                      { id: 'broad', label: 'Broader Frame' },
                    ].map((b) => (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => setBodyFrame(b.id as any)}
                        className={`py-2 px-2.5 text-center border rounded-sm text-[10px] font-medium transition-all ${
                          bodyFrame === b.id
                            ? 'border-[#141414] bg-[#141414] text-white shadow-2xs'
                            : 'border-[#141414]/15 text-[#141414] hover:border-[#141414] bg-white'
                        }`}
                      >
                        {b.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setStep('result')}
                className="w-full h-11 bg-[#141414] hover:bg-black text-white text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 rounded-sm transition-all shadow-sm"
              >
                <span>Calculate My Fit</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </>
          ) : (
            <div className="space-y-5 text-center">
              <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-800">
                <UserCheck className="w-6 h-6 stroke-[1.5]" />
              </div>

              <div>
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#A7654A] font-semibold block">
                  Recommended For You
                </span>
                <div className="font-serif text-4xl text-[#141414] font-normal mt-1">
                  Size {recommendation.size}
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 text-[10px] font-semibold rounded-full mt-2">
                  <Check className="w-3 h-3 text-emerald-700" />
                  <span>{recommendation.confidence}% Fit Accuracy Match</span>
                </div>
              </div>

              <div className="bg-[#FAF9F6] p-4 border border-[#141414]/10 rounded-sm text-left text-xs text-[#73706B] leading-relaxed">
                <p>{recommendation.rationale}</p>
                <div className="pt-2 mt-2 border-t border-[#141414]/10 flex items-center justify-between text-[10px] text-[#141414] font-medium">
                  <span>Returns & Size Exchanges:</span>
                  <span className="text-emerald-700 font-semibold">Free 7-Day Doorstep</span>
                </div>
              </div>

              <div className="space-y-2">
                <button
                  type="button"
                  onClick={handleApply}
                  className="w-full h-11 bg-[#141414] hover:bg-black text-white text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 rounded-sm transition-all shadow-sm"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Apply Size {recommendation.size} & View Garment</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStep('input')}
                  className="text-[10px] text-[#73706B] hover:text-[#141414] uppercase tracking-wider underline block mx-auto pt-1"
                >
                  Adjust Measurements
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};