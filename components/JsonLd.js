import Script from 'next/script';

/**
 * JsonLd component for rendering structured data
 * This component ensures JSON-LD is properly rendered in the HTML
 */
export default function JsonLd({ data, id }) {
  return (
    <Script
      id={id || 'json-ld'}
      type="application/ld+json"
      strategy="beforeInteractive"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data),
      }}
    />
  );
}
