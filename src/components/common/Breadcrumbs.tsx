import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className = '' }) => {
  return (
    <nav aria-label="Breadcrumb" className={`text-[10px] sm:text-xs uppercase tracking-wider text-[#777765] ${className}`}>
      <ol className="flex items-center flex-wrap gap-1.5 sm:gap-2">
        <li className="shrink-0">
          <Link to="/" className="hover:text-[#211E1A] transition-colors">
            DUKAAN
          </Link>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="flex items-center gap-1.5 sm:gap-2 min-w-0">
              <ChevronRight className="w-3 h-3 text-[#A7654A]/60 shrink-0" />
              {isLast || !item.href ? (
                <span className="text-[#211E1A] font-medium truncate max-w-[130px] sm:max-w-[280px] lg:max-w-none inline-block align-bottom" aria-current="page" title={item.label}>
                  {item.label}
                </span>
              ) : (
                <Link to={item.href} className="hover:text-[#211E1A] transition-colors truncate max-w-[110px] sm:max-w-[200px] lg:max-w-none inline-block align-bottom">
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
