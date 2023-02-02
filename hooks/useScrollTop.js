import { useEffect } from 'react';

const useSmoothAnimatedScrollToTop = (dependency) => {
  useEffect(() => {
    const scrollToTop = () => {
      if (window.scrollY === 0) return;
      const easeOutQuint = (t) => 1 - --t * t * t * t * t;
      const progress = easeOutQuint(window.scrollY / window.innerHeight);
      window.scrollTo(0, window.scrollY - (progress * window.innerHeight) / 8);
      requestAnimationFrame(scrollToTop);
    };

    scrollToTop();
  }, [dependency]);
};

export default useSmoothAnimatedScrollToTop;
