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
      <div className={styles.welcomeContent}>
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

        <div>
          <div className={styles.welcomeImage}>
            <AnimationBox animation={'grow-from-bottom'}>
              <div>
                <Image
                  src={rawFoodPlate}
                  alt='Plato comida natural para mascotas'
                />
              </div>
            </AnimationBox>
          </div>

          <div className={styles.welcomeQuote}>
            <blockquote>
              <span>&ldquo;</span>La calidad de vida de nuestras mascotas{' '}
              <span>depende enormemente de la comida</span> que les damos. Las
              recetas de DNAture han sido formuladas para{' '}
              <span>mejorar y preservar esa calidad de vida</span>.
              <span>&rdquo;</span>
            </blockquote>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
