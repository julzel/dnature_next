import Script from 'next/script';
import { useId } from 'react';

/**
 * JsonLd component for rendering structured data
 * Uses Next.js Script component with stable ID for hydration compatibility
 */
export default function JsonLd({ data }) {
  const id = useId();
  
  return (
    <Script
      id={`jsonld-${id}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
      strategy="afterInteractive"
    />
  );
}
