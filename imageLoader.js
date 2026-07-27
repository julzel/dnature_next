const CONTENTFUL_IMAGE_HOSTS = new Set([
  'images.ctfassets.net',
  'images.eu.ctfassets.net',
]);

export default function contentfulLoader({ src, width, quality }) {
  if (typeof src !== 'string' || !src.trim()) {
    return src;
  }

  const normalizedSource = src.startsWith('//') ? `https:${src}` : src;
  let url;

  try {
    url = new URL(normalizedSource);
  } catch {
    return src;
  }

  if (!CONTENTFUL_IMAGE_HOSTS.has(url.hostname)) {
    return src;
  }

  const configuredQuality = Number.parseInt(url.searchParams.get('q'), 10);
  const targetQuality =
    quality ||
    (Number.isInteger(configuredQuality) ? configuredQuality : 75);

  // Override any service-level fallback width so every generated srcset entry
  // asks Contentful for the width selected by the browser.
  url.searchParams.set('w', String(Math.min(width, 1600)));
  url.searchParams.set('q', String(targetQuality));
  url.searchParams.set('fm', 'webp');

  return url.toString();
}
