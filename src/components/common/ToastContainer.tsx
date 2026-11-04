import React from 'react';
import { useUIStore } from '../../store/useUIStore';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useUIStore();

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-auto bg-[#211E1A] text-[#F3F0E9] border border-white/10 p-4 shadow-luxury flex items-center justify-between gap-3 text-sm"
          >
            <div className="flex items-center gap-3">
              {toast.type === 'success' ? (
                <div className="w-5 h-5 rounded-full bg-[#A7654A] flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 text-[#F3F0E9]" />
                </div>
              ) : (
                <Info className="w-4 h-4 text-[#A7654A] shrink-0" />
              )}
              <span className="font-light tracking-wide text-xs sm:text-sm">{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-[#777765] hover:text-[#F3F0E9] transition-colors p-1"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
