import Image from 'next/image';

import styles from './HeroImage.module.scss';

const HeroImage = () => (
  <div className={styles.imageContainer}>
    <Image
      alt="Perro junto a un tazón de alimento natural"
      className={styles.image}
      fill
      priority
      sizes="(min-width: 768px) 50vw, 100vw"
      src="/images/hero3.jpg"
    />
  </div>
);

export default HeroImage;
