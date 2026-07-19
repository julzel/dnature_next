const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://dnaturefood.com';
const defaultSocialImage = '/images/hero3.jpg';

const canonicalPath = (path = '/') => {
  if (path === '/') return '/';

  return `${path.replace(/\/+$/, '')}/`;
};

const absoluteUrl = (path = '/') => new URL(canonicalPath(path), siteUrl).toString();

const createPageMetadata = ({
  title,
  description,
  path,
  image = defaultSocialImage,
  imageAlt = 'DNAture, alimentación natural para mascotas',
  robots,
}) => {
  const canonical = canonicalPath(path);

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: 'website',
      locale: 'es_CR',
      siteName: 'DNAture',
      title,
      description,
      url: canonical,
      images: image ? [{ url: image, alt: imageAlt }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: image ? [image] : [],
    },
    ...(robots ? { robots } : {}),
  };
};

export { absoluteUrl, canonicalPath, createPageMetadata, defaultSocialImage, siteUrl };
