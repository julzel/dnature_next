import { useCallback, useSyncExternalStore } from 'react';
import SCREEN_SIZE from '../constants/breakpoints';

const subscribeToViewport = (callback) => {
  window.addEventListener('resize', callback);
  return () => window.removeEventListener('resize', callback);
};

const useWindow = () => {
  const { TABLET } = SCREEN_SIZE;
  const getSnapshot = useCallback(() => window.innerWidth < TABLET, [TABLET]);
  const getServerSnapshot = useCallback(() => false, []);

  return useSyncExternalStore(subscribeToViewport, getSnapshot, getServerSnapshot);
};

export default useWindow;
