import React from 'react';
import Image from 'next/image';

// local imports
// components
import AnimationBox from '../../../components/AnimationBox';

// styles
import styles from './Welcome.module.scss';

// images
import rawFoodPlate from '../../../public/images/our-ingredients-plate.png';

// data
import items from './items';

const Welcome = () => {
  return (
    <div className={styles.welcome}>
      <h2 className='seo-hidden'>Alimentación DNAture</h2>

      <div className={styles.welcomeItems}>
        <ul>
          {items.map((item, i) => {
            const animation =
              i % 2 === 0 ? 'fade-in-from-left' : 'fade-in-from-right';
            return (
              <li key={i} className={styles.welcomeItemsItem}>
                <AnimationBox animation={animation}>
                  <div
                    className={styles.welcomeItemsImage}
                    style={{
                      width: item.smallIcon ? '65px' : '',
                    }}
                  >
                    <Image src={item.icon} alt={item.title} />
                  </div>
                  <h4 className={styles.welcomeItemsTitle}>{item.title}</h4>
                  <p className={styles.welcomeItemsText}>{item.text}</p>
                </AnimationBox>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Welcome;
