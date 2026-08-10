'use client';

import Image from 'next/image';

// local imports
// styles
import styles from './OurCostumers.module.scss';

// data
import costumers from './costumers';

// components
import Slider from '../../../components/Slider';

const slides = costumers.map((costumer) => {
  return (
    <article key={costumer.name} className={styles.testimonial}>
      {costumer.thumbnail && (
        <div className={styles.imageFrame}>
          <Image
            src={costumer.thumbnail.image}
            alt={costumer.thumbnail.alt}
            fill
            sizes='(min-width: 1024px) 380px, (min-width: 768px) 42vw, calc(100vw - 64px)'
            className={styles.image}
          />
          <span className={styles.imageAccent} aria-hidden='true' />
        </div>
      )}

      <div className={styles.testimonialContent}>
        <span className={styles.quoteMark} aria-hidden='true'>
          “
        </span>
        <blockquote className={styles.quote}>
          <p>{costumer.quote}</p>
        </blockquote>
        <footer className={styles.customer}>
          <p className={styles.customerName}>{costumer.name}</p>
        {costumer.socialMedia && (
          <a
            href={costumer.socialMedia.link}
            target='_blank'
            rel='noopener noreferrer'
            className={styles.socialMedia}
            aria-label={`Ver a ${costumer.socialMedia.user} en Instagram`}
          >
            {costumer.socialMedia.user}
          </a>
        )}
        </footer>
      </div>
    </article>
  );
});

const OurCostumers = () => {
  return (
    <section
      className={styles.ourCustomers}
      aria-labelledby='customer-stories-title'
    >
      <div className={styles.heading}>
        <p className={styles.eyebrow}>Historias de la comunidad</p>
        <h2 id='customer-stories-title'>Ellos ya viven la experiencia DNAture</h2>
        <p className={styles.introduction}>
          Familias que eligieron una alimentación más natural para acompañar
          el bienestar de sus mascotas.
        </p>
      </div>

      <div className={styles.sliderFrame}>
        <Slider slides={slides} />
      </div>
    </section>
  );
};

export default OurCostumers;
