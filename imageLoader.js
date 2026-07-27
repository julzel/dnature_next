const CONTENTFUL_IMAGE_HOSTS = new Set([
  'images.ctfassets.net',
  'images.eu.ctfassets.net',
]);

const normalizeImageSource = (src) => {
  if (typeof src !== 'string') {
    return src;
  }

  const trimmedSource = src.trim();

  return trimmedSource.startsWith('//')
    ? `https:${trimmedSource}`
    : trimmedSource;
};

const isContentfulImageUrl = (src) => {
  const normalizedSource = normalizeImageSource(src);

  if (typeof normalizedSource !== 'string' || !normalizedSource) {
    return false;
  }

  try {
    return CONTENTFUL_IMAGE_HOSTS.has(new URL(normalizedSource).hostname);
  } catch {
    return false;
  }
};

const contentfulLoader = ({ src, width, quality }) => {
  const normalizedSource = normalizeImageSource(src);

  if (typeof normalizedSource !== 'string' || !normalizedSource) {
    return normalizedSource;
  }

  let url;

  try {
    url = new URL(normalizedSource);
  } catch {
    return normalizedSource;
  }

  if (!CONTENTFUL_IMAGE_HOSTS.has(url.hostname)) {
    return normalizedSource;
  }

  const configuredQuality = Number.parseInt(url.searchParams.get('q'), 10);
  const targetQuality =
    quality || (Number.isInteger(configuredQuality) ? configuredQuality : 75);

  url.searchParams.set('w', String(Math.min(width, 1600)));
  url.searchParams.set('q', String(targetQuality));
  url.searchParams.set('fm', 'webp');

  return url.toString();
};

export default contentfulLoader;
export {
  CONTENTFUL_IMAGE_HOSTS,
  isContentfulImageUrl,
  normalizeImageSource,
};
