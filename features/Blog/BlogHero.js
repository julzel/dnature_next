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
          <br /><span>Nutrición con amor</span>
        </h2>

        {/* <p className={styles.heroActionParagraph}>
          Este es un espacio dedicado a ofrecerte valiosa y confiable
          información sobre la alimentación natural y tenencia responsable de
          tus amados compañeros de cuatro patas.
        </p> */}

        <div className={styles.heroActionButtons}></div>
      </div>
      <div className={styles.hero}>
        <div className={styles.heroImg} />
      </div>
    </div>
  );
};

export default Hero;
