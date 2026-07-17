'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/compat/router';

const useCompatibleNavigation = () => {
  const router = useRouter();

  const push = useCallback(
    (href) => {
      if (router) {
        return router.push(href);
      }

      window.location.assign(href);
      return undefined;
    },
    [router]
  );

  const back = useCallback(() => {
    if (router) {
      router.back();
      return;
    }

    if (window.history.length > 1) {
      window.history.back();
      return;
    }

    window.location.assign('/');
  }, [router]);

  return { back, push, router };
};

export default useCompatibleNavigation;
