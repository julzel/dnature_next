import { useEffect, useState, useCallback } from 'react';
import SCREEN_SIZE from '../constants/breakpoints';

const useWindow = () => {
  const [isMobile, setIsMobile] = useState(true);
  const { TABLET } = SCREEN_SIZE;

  const handleWindowResize = useCallback(() => {
    setIsMobile(window.innerWidth < TABLET);
  }, [TABLET]);

  useEffect(() => {
    handleWindowResize();
    window.addEventListener('resize', handleWindowResize);

    return () => window.removeEventListener('resize', handleWindowResize);
  }, [handleWindowResize]);

  return isMobile;
};

export default useWindow;
