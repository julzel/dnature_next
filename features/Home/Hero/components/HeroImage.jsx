import { getImageProps } from 'next/image';

import desktopHero from '../../../../public/images/hero3.jpg';
import mobileHero from '../../../../public/images/hero3_wide.jpg';

const alt = 'Perro junto a un tazón de alimento natural';

const HeroImage = () => {
  const {
    props: { srcSet: desktopSrcSet },
  } = getImageProps({
    alt,
    priority: true,
    quality: 75,
    sizes: '50vw',
    width: 300,
    height: Math.round(300 * (desktopHero.height || 300) / (desktopHero.width || 300)),
    src: desktopHero,
  });
  const {
    props: { srcSet: mobileSrcSet, ...imageProps },
  } = getImageProps({
    alt,
    priority: true,
    quality: 75,
    sizes: '100vw',
    width: 300,
    height: Math.round(300 * (mobileHero.height || 300) / (mobileHero.width || 300)),
    src: mobileHero,
  });

  delete imageProps.style;

  return (
    <div>
      <picture>
        <source media='(min-width: 768px)' srcSet={desktopSrcSet} sizes='50vw' />
        <source media='(max-width: 767px)' srcSet={mobileSrcSet} sizes='100vw' />
        <img {...imageProps} alt={alt} />
      </picture>
    </div>
  );
};

export default HeroImage;
