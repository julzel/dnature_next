import { getImageProps } from 'next/image';

import desktopHero from '../../../../public/images/hero3.jpg';
import mobileHero from '../../../../public/images/hero3_wide.jpg';
import styles from './HeroImage.module.scss';

const alt = 'Perro junto a un tazón de alimento natural';

const HeroImage = () => {
  const {
    props: { srcSet: desktopSrcSet },
  } = getImageProps({
    alt,
    fill: true,
    priority: true,
    quality: 75,
    sizes: '50vw',
    src: desktopHero,
  });
  const {
    props: { srcSet: mobileSrcSet, ...imageProps },
  } = getImageProps({
    alt,
    fill: true,
    priority: true,
    quality: 75,
    sizes: '100vw',
    src: mobileHero,
  });

  return (
    <div className={styles.imageContainer}>
      <picture>
        <source media='(min-width: 768px)' srcSet={desktopSrcSet} sizes='50vw' />
        <source media='(max-width: 767px)' srcSet={mobileSrcSet} sizes='100vw' />
        <img {...imageProps} alt={alt} className={styles.image} />
      </picture>
    </div>
  );
};

export default HeroImage;
