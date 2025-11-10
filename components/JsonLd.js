'use client';

import Script from 'next/script';

/**
 * JsonLd component for rendering structured data
 * Client component to avoid hydration issues with Next.js Script
 */
export default function JsonLd({ data, id }) {
  return (
    <Script
      id={id || 'json-ld'}
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data),
      }}
    />
  );
}
