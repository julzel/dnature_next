const CONTENTFUL_IMAGE_HOSTS = new Set([
  'images.ctfassets.net',
  'images.eu.ctfassets.net',
]);

const isContentfulImageUrl = (src) => {
  if (typeof src !== 'string' || !src.trim()) {
    return false;
  }

  const trimmedSource = src.trim();
  const normalizedSource = trimmedSource.startsWith('//')
    ? `https:${trimmedSource}`
    : trimmedSource;

  try {
    return CONTENTFUL_IMAGE_HOSTS.has(new URL(normalizedSource).hostname);
  } catch {
    return false;
  }
};

export default function contentfulLoader({ src, width, quality }) {
  if (typeof src !== 'string') {
    return src;
  }

  const trimmedSource = src.trim();

  if (!trimmedSource) {
    return trimmedSource;
  }

  const normalizedSource = trimmedSource.startsWith('//')
    ? `https:${trimmedSource}`
    : trimmedSource;
  let url;

  try {
    url = new URL(normalizedSource);
  } catch {
    return trimmedSource;
  }

  if (!CONTENTFUL_IMAGE_HOSTS.has(url.hostname)) {
    return normalizedSource;
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

export { isContentfulImageUrl };
