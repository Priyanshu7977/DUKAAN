import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
  subtitle?: string;
}

interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
  defaultOpenId?: string;
  className?: string;
}

export const Accordion: React.FC<AccordionProps> = ({
  items,
  allowMultiple = false,
  defaultOpenId,
  className = '',
}) => {
  const [openIds, setOpenIds] = useState<string[]>(defaultOpenId ? [defaultOpenId] : []);

  const toggle = (id: string) => {
    if (allowMultiple) {
      setOpenIds((prev) =>
        prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
      );
    } else {
      setOpenIds((prev) => (prev.includes(id) ? [] : [id]));
    }
  };

  return (
    <div className={`divide-y divide-[#211E1A]/10 border-y border-[#211E1A]/10 ${className}`}>
      {items.map((item) => {
        const isOpen = openIds.includes(item.id);
        return (
          <div key={item.id} className="py-4 sm:py-5">
            <button
              onClick={() => toggle(item.id)}
              className="w-full flex items-center justify-between text-left group transition-colors"
              aria-expanded={isOpen}
            >
              <div>
                <span className="font-serif text-lg sm:text-xl text-[#211E1A] group-hover:text-[#A7654A] transition-colors">
                  {item.title}
                </span>
                {item.subtitle && (
                  <p className="text-xs uppercase tracking-widest text-[#777765] mt-1">
                    {item.subtitle}
                  </p>
                )}
              </div>
              <div className="ml-4 shrink-0 w-8 h-8 rounded-full border border-[#211E1A]/10 flex items-center justify-center text-[#211E1A] group-hover:border-[#A7654A] group-hover:text-[#A7654A] transition-all">
                {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              </div>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key="content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <div className="pt-4 text-[#777765] text-sm leading-relaxed font-light">
                    {item.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};
