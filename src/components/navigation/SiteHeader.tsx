import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { cn } from '../../utils/formatters';

export const SiteHeader: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Always show at top of page
      if (currentScrollY <= 20) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY.current && currentScrollY - lastScrollY.current > 6) {
        // Scrolling down -> hide header smoothly
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY.current && lastScrollY.current - currentScrollY > 6) {
        // Scrolling up -> show header smoothly without covering content
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // On page change, ensure header is visible
  useEffect(() => {
    setIsVisible(true);
  }, [location.pathname]);

  return (
    <div
      className={cn(
        'fixed inset-x-0 top-0 z-50 flex justify-center pointer-events-none transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] px-3 sm:px-6 pt-2 sm:pt-3 pb-1',
        isVisible ? 'translate-y-0' : '-translate-y-28'
      )}
    >
      <Navbar />
    </div>
  );
};
