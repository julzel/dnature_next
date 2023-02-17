import React from 'react';
import Image from 'next/image';

// local imports
// data
import benefits from './benefits';

// styles
import styles from './Benefits.module.scss';

// images
import pawIcon from '../../../public/images/paw.svg';

// components
import AnimationBox from '../../../components/AnimationBox';

const Benefits = () => {
  return (
    <div className={styles.benefits}>
      <h2 className={`title ${styles.title}`}>Beneficios</h2>
      <div className={styles.benefitsContainer}>
        <ul>
          {benefits.map((benefit, i) => (
            <li key={i}>
              <AnimationBox animation='fade-in-from-left'>
                {/* <Image src={pawIcon} alt='pawIcon' /> */}
                {benefit}
              </AnimationBox>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Benefits;
