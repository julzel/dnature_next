import Image from 'next/image';

import styles from './HeroBadge.module.scss';

const HeroBadge = () => (
  <Image
    alt="Nutrición real para su bienestar"
    className={styles.badge}
    height={180}
    src="/home/hero/nutricion-real-badge.svg"
    unoptimized
    width={180}
    style={{ maxWidth: '150px' }}
  />
);

export default HeroBadge;
