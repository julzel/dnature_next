const CONTENTFUL_IMAGE_HOSTS = new Set([
  'images.ctfassets.net',
  'images.eu.ctfassets.net',
]);

const normalizeImageUrl = (source) => {
  if (typeof source !== 'string') {
    return source;
  }

  const trimmedSource = source.trim();

  return trimmedSource.startsWith('//')
    ? `https:${trimmedSource}`
    : trimmedSource;
};

const getOptimizedContentfulImageUrl = (
  source,
  { width, height, quality = 75, format = 'webp', fit } = {}
) => {
  const normalizedSource = normalizeImageUrl(source);

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

  if (Number.isInteger(width) && width > 0) {
    url.searchParams.set('w', String(width));
  }

  if (Number.isInteger(height) && height > 0) {
    url.searchParams.set('h', String(height));
  }

  if (format) {
    url.searchParams.set('fm', format);
  }

  if (Number.isInteger(quality) && quality >= 1 && quality <= 100) {
    url.searchParams.set('q', String(quality));
  }

  if (fit) {
    url.searchParams.set('fit', fit);
  }

  return url.toString();
};

const optimizeContentfulImage = (image, options) => {
  if (!image?.url) {
    return image;
  }

  return {
    ...image,
    url: getOptimizedContentfulImageUrl(image.url, options),
  };
};

export {
  getOptimizedContentfulImageUrl,
  normalizeImageUrl,
  optimizeContentfulImage,
};
