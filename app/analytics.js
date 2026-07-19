'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';
import { usePathname } from 'next/navigation';

const analyticsId = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS;
const ANALYTICS_CONSENT_KEY = 'dnature-analytics-consent';

const hasAnalyticsConsent = () =>
  typeof window !== 'undefined' &&
  window.localStorage.getItem(ANALYTICS_CONSENT_KEY) === 'granted';

const Analytics = () => {
  const pathname = usePathname();
  const [hasConsent, setHasConsent] = useState(false);

  useEffect(() => {
    const updateConsent = () => setHasConsent(hasAnalyticsConsent());

    updateConsent();
    window.addEventListener('dnature-analytics-consent', updateConsent);
    window.addEventListener('storage', updateConsent);

    return () => {
      window.removeEventListener('dnature-analytics-consent', updateConsent);
      window.removeEventListener('storage', updateConsent);
    };
  }, []);

  useEffect(() => {
    if (!analyticsId || !hasConsent || typeof window.gtag !== 'function') {
      return;
    }

    window.gtag('config', analyticsId, { page_path: pathname });
  }, [hasConsent, pathname]);

  if (!analyticsId || !hasConsent) {
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
export { ANALYTICS_CONSENT_KEY, hasAnalyticsConsent };
