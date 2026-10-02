import { getImageProps } from 'next/image';

import desktopHero from '../../../../public/images/hero3.jpg';
import mobileHero from '../../../../public/images/hero3_wide.jpg';

const alt = 'Perro junto a un tazón de alimento natural';

const HeroImage = () => {
  const {
    props: { srcSet: desktopSrcSet },
  } = getImageProps({
    alt,
    loading: 'eager',
    quality: 75,
    sizes: '50vw',
    width: desktopHero.width || 2074,
    height: desktopHero.height || 2074,
    src: desktopHero,
  });
  const {
    props: { srcSet: mobileSrcSet, ...imageProps },
  } = getImageProps({
    alt,
    loading: 'eager',
    quality: 75,
    sizes: '100vw',
    width: mobileHero.width || 2100,
    height: mobileHero.height || 1400,
    src: mobileHero,
  });

  delete imageProps.style;

  return (
    <div className='hero-image'>
      <picture>
        <source media='(min-width: 768px)' srcSet={desktopSrcSet} sizes='50vw' />
        <source media='(max-width: 767px)' srcSet={mobileSrcSet} sizes='100vw' />
        <img {...imageProps} alt={alt} />
      </picture>
    </div>
  );
};

export default HeroImage;
