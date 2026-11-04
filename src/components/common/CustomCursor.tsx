import React, { useEffect, useState } from 'react';

export const CustomCursor: React.FC = () => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [trailingPos, setTrailingPos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isPointerDevice, setIsPointerDevice] = useState(false);

  useEffect(() => {
    // Only enable on devices that have a real pointer/mouse (not touch-only)
    const mediaQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
    setIsPointerDevice(mediaQuery.matches);

    const handleMediaChange = (e: MediaQueryListEvent) => {
      setIsPointerDevice(e.matches);
    };
    mediaQuery.addEventListener('change', handleMediaChange);

    const handleMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

      // Check if target or its parent is interactive
      const target = e.target as HTMLElement | null;
      if (target) {
        const interactive = target.closest('a, button, input, select, textarea, [role="button"], .cursor-pointer');
        setIsHovered(Boolean(interactive));
      }
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      mediaQuery.removeEventListener('change', handleMediaChange);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [isVisible]);

  // Smooth trailing effect using requestAnimationFrame
  useEffect(() => {
    if (!isPointerDevice) return;
    let animationFrameId: number;

    const followCursor = () => {
      setTrailingPos((prev) => {
        const dx = pos.x - prev.x;
        const dy = pos.y - prev.y;
        return {
          x: prev.x + dx * 0.22,
          y: prev.y + dy * 0.22,
        };
      });
      animationFrameId = requestAnimationFrame(followCursor);
    };

    animationFrameId = requestAnimationFrame(followCursor);
    return () => cancelAnimationFrame(animationFrameId);
  }, [pos, isPointerDevice]);

  if (!isPointerDevice || !isVisible) return null;

  return (
    <>
      {/* Precision Center Dot */}
      <div
        className="fixed top-0 left-0 pointer-events-none z-[9999] transition-transform duration-75 ease-out"
        style={{
          transform: `translate3d(${pos.x - 3}px, ${pos.y - 3}px, 0)`,
        }}
      >
        <div className="w-1.5 h-1.5 rounded-full bg-[#141414] dark:bg-white shadow-[0_0_4px_rgba(0,0,0,0.4)]" />
      </div>

      {/* Luxury Dynamic Follower Ring - Always visible over light and dark backgrounds */}
      <div
        className="fixed top-0 left-0 pointer-events-none z-[9998] transition-all duration-150 ease-out"
        style={{
          transform: `translate3d(${trailingPos.x - (isHovered ? 24 : 16)}px, ${
            trailingPos.y - (isHovered ? 24 : 16)
          }px, 0)`,
          width: isHovered ? '48px' : '32px',
          height: isHovered ? '48px' : '32px',
        }}
      >
        <div
          className={`w-full h-full rounded-full border transition-all duration-200 ${
            isHovered
              ? 'border-[#A7654A] bg-[#A7654A]/10 scale-110 shadow-[0_0_12px_rgba(167,101,74,0.3)]'
              : 'border-[#141414]/40 bg-white/10 backdrop-contrast-125'
          }`}
        />
      </div>
    </>
  );
};
