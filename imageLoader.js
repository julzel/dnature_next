// Custom image loader for Contentful
// This bypasses Next.js image optimization and uses Contentful's own optimization

export default function contentfulLoader({ src, width, quality }) {
  // If it's a Contentful image, use their image API
  if (src.startsWith('https://images.ctfassets.net')) {
    const url = new URL(src);
    url.searchParams.set('w', width.toString());
    url.searchParams.set('q', (quality || 75).toString());
    url.searchParams.set('fm', 'webp'); // Use WebP format for better performance
    return url.toString();
  }
  
  // For other images, return as-is
  return src;
}
