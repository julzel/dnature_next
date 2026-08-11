import { Leaf } from 'lucide-react';

import styles from './HeroEyebrow.module.scss';

const HeroEyebrow = () => {
  return (
    <div className={styles.heroEyebrow}>
      <span className={styles.iconContainer}>
        <Leaf aria-hidden="true" className={styles.icon} strokeWidth={2} />
      </span>
      <span>Alimentación natural hecha en Costa Rica</span>
    </div>
  );
};

export default HeroEyebrow;
