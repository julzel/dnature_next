import React from 'react';
import Image from 'next/image';

// local imports
// styles
import styles from './OurCostumers.module.scss';

// data
import costumers from './costumers';

// components
import Slider from '../../../components/Slider';

const slides = costumers.map((costumer, i) => {
  return (
    <div key={`costumer-${i}`} className={styles.costumer}>
      <div className={styles.costumerContent}>
        <blockquote className={styles.costumerContentQuote}>
          <span>{costumer.quote}</span>
        </blockquote>
        <p className={styles.costumerContentName}>{costumer.name}</p>
        {costumer.socialMedia && (
          <a
            href={costumer.socialMedia.link}
            target='_blank'
            rel='noreferrer'
            className={styles.costumerContentSocialMedia}
          >
            {costumer.socialMedia.user}
          </a>
        )}
      </div>
      {costumer.thumbnail && (
        <div className={styles.costumerThumbnail}>
          <Image src={costumer.thumbnail.image} alt={costumer.thumbnail.alt} />
        </div>
      )}
    </div>
  );
});

const OurCostumers = () => {
  return (
    <div className={styles.OurCostumers}>
      <Slider slides={slides} autoplay interval={28} />
    </div>
  );
};

export default OurCostumers;
