import React from 'react';
import Image from 'next/image';

// local imports
// styles
import styles from './DNAtureSystem.module.scss';

// data
import SystemItems from './system-items';

// components
import AnimationBox from '../../../components/AnimationBox';

const DNAtureSystem = () => {
  return (
    <>
      <section className={styles.dnatureSystem}>
        <h2 className={`title ${styles.title}`}>Plan de alimentación</h2>
        <div className={styles.dnatureSystemContainer}>
          {SystemItems.map((item, i) => (
            <AnimationBox animation='fade-in-from-right' key={i}>
              <div className={styles.dnatureSystemItem}>
                <h3 className={styles.dnatureSystemItemTitle}>{item}</h3>
              </div>
            </AnimationBox>
          ))}
        </div>
      </section>
      <div className={styles.dnaturePlate} />
    </>
  );
};

export default DNAtureSystem;
