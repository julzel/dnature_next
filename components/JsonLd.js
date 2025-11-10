import Script from 'next/script';

/**
 * JsonLd component for rendering structured data
 * Uses Next.js Script component with afterInteractive strategy for production compatibility
 */
export default function JsonLd({ data }) {
  return (
    <Script
      id={`jsonld-${Math.random().toString(36).substr(2, 9)}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
      strategy="afterInteractive"
    />
  );
}
