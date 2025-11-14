'use client';

import { useEffect, useState } from 'react';

const SCROLL_THRESHOLD = 8;
const OFFSET = 96;

const useHideOnScroll = () => {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let frameId = null;

    const handleScroll = () => {
      if (frameId) return;
      frameId = window.requestAnimationFrame(() => {
        const currentY = window.scrollY;
        const diff = currentY - lastScrollY;

        if (Math.abs(diff) > SCROLL_THRESHOLD) {
          const shouldHide = diff > 0 && currentY > OFFSET;
          setHidden(shouldHide);
          lastScrollY = currentY;
        }

        frameId = null;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, []);

  return hidden;
};

export default useHideOnScroll;
