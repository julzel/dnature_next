import React from 'react';
import styles from './BlogHero.module.scss';

const Hero = ({ handlePlanDnaClick, handleComprarClick }) => {
  return (
    <div className={styles.blogHeroContainer}>
      <h1 className="seo-hidden">
        Alimentación natural y dieta cruda para mascotas. Snacks, suplementos y
        planes de nutrición personalizados
      </h1>
      <div className={styles.heroAction}>
        <h2 className={styles.heroActionTitle}>
          DNAture Blog
          <br /><span>Nutrición con conciencia</span>
        </h2>

        <div className={styles.heroActionButtons}></div>
      </div>
      <div className={styles.hero}>
        <div className={styles.heroImg} />
      </div>
    </div>
  );
};

export default Hero;
