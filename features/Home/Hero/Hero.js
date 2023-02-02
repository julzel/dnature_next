import React from 'react';
import ResponsiveImage from '../../../components/ResponsiveImage';
import HeroButton from './HeroButton';
import styles from './Hero.module.scss';

const Hero = ({ imageSrc, isMobile, handlePlanDnaClick }) => {
  return (
    <div className={styles.heroContainer}>
      <h1 className='seo-hidden'>
        Alimentación natural y dieta cruda para mascotas
      </h1>
      <div className={styles.heroAction}>
        <h2 className={styles.heroActionTitle}>
          <div>
            La forma
            {isMobile ? <br /> : ' '}
            <span>natural</span>
          </div>
          <div>
            de <span>alimentar</span>
            {isMobile ? <br /> : ' '}a tu mascota
          </div>
        </h2>

        <div>
          <HeroButton text={'Plan DNA'} onClick={handlePlanDnaClick} />
          <HeroButton text={'Comprar'} variant={'secondary'} />
        </div>
      </div>
      <div className={styles.hero}>
        <ResponsiveImage src={imageSrc} alt={'DNAture'} flipY />
        <div></div>
      </div>
    </div>
  );
};

export default Hero;
