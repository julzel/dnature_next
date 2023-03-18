import React from 'react';
import Image from 'next/image';

// local imports
// data
import benefits from './benefits';

// styles
import styles from './Benefits.module.scss';

// images
import benefitsImage from '../../../public/images/benefits.jpg';

// components
import AnimationBox from '../../../components/AnimationBox';

const Benefits = () => {
  return (
    <div className={styles.benefits}>
      <div className={styles.benefitsContainer}>
        <h2 className={`title ${styles.title}`}>Beneficios</h2>
        <ul className={styles.list}>
          {benefits.map((benefit, i) => (
            <li key={i}>
              <AnimationBox animation='fade-in-from-left'>
                {/*  */}
                {benefit}
              </AnimationBox>
            </li>
          ))}
        </ul>
      </div>
      <div className={styles.benefitsImage}>
          <Image src={benefitsImage} alt='Perrito saludable comiendo' /> 
        </div>
    </div>
  );
};

export default Benefits;
