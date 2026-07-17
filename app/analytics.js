'use client';

import { useEffect } from 'react';
import Script from 'next/script';
import { usePathname } from 'next/navigation';

const analyticsId = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS;

const Analytics = () => {
  const pathname = usePathname();

  useEffect(() => {
    if (!analyticsId || typeof window.gtag !== 'function') {
      return;
    }

    window.gtag('config', analyticsId, { page_path: pathname });
  }, [pathname]);

  if (!analyticsId) {
    return null;
  }

  return (
    <>
      <Script
        strategy='lazyOnload'
        src={`https://www.googletagmanager.com/gtag/js?id=${analyticsId}`}
      />
      <Script strategy='lazyOnload' id='google-analytics'>
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          window.gtag = window.gtag || gtag;
          window.gtag('js', new Date());
          window.gtag('config', '${analyticsId}');
        `}
      </Script>
    </>
  );
};

export default Analytics;
