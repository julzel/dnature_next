'use client';

import Image from 'next/image';

import contentfulLoader, {
  isContentfulImageUrl,
  normalizeImageSource,
} from '../../imageLoader';

const ContentfulImage = ({ src, alt, ...props }) => {
  const normalizedSource = normalizeImageSource(src);

  if (!normalizedSource) {
    return null;
  }

  const loaderProps = isContentfulImageUrl(normalizedSource)
    ? { loader: contentfulLoader }
    : {};

  return (
    <Image
      {...props}
      {...loaderProps}
      src={normalizedSource}
      alt={typeof alt === 'string' ? alt : ''}
    />
  );
};

export default ContentfulImage;
