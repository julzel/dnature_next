import { getImageProps } from 'next/image';

// Keep optimized sources and native image dimensions without Next's inline styles.
const Image = ({ alt = '', width, height, ...props }) => {
  const intrinsicWidth = width || props.src?.width || 300;
  const intrinsicHeight = height || props.src?.height || 300;
  const imageWidth = Math.min(intrinsicWidth, 240);
  const imageHeight = Math.round(intrinsicHeight * imageWidth / intrinsicWidth);
  const { props: imageProps } = getImageProps({
    ...props,
    alt,
    width: imageWidth,
    height: imageHeight,
  });
  delete imageProps.style;

  // Sources and srcSet are optimized by getImageProps above.
  // eslint-disable-next-line @next/next/no-img-element
  return <img {...imageProps} alt={alt} />;
};

export default Image;
