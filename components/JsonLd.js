/**
 * JsonLd component for rendering structured data
 * Renders as a standard script tag to avoid hydration issues
 */
export default function JsonLd({ data }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
