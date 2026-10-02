import { getImageProps } from 'next/image';

// Keep optimized sources and native image dimensions without Next's inline styles.
const Image = ({ alt = '', width, height, ...props }) => {
  const intrinsicWidth = width || props.src?.width || 300;
  const intrinsicHeight = height || props.src?.height || 300;
  const { props: imageProps } = getImageProps({
    ...props,
    alt,
    width: intrinsicWidth,
    height: intrinsicHeight,
  });
  delete imageProps.style;

  // Sources and srcSet are optimized by getImageProps above.
  // eslint-disable-next-line @next/next/no-img-element
  return <img {...imageProps} alt={alt} />;
};

export default Image;
