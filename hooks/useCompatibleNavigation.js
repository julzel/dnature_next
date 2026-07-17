'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';

const useCompatibleNavigation = () => {
  const router = useRouter();

  const push = useCallback((href) => router.push(href), [router]);

  const back = useCallback(() => router.back(), [router]);

  return { back, push, router };
};

export default useCompatibleNavigation;
