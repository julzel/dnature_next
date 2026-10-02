'use client';

import Image from '../../../components/Image';
import { SectionHeading } from '../../../components/DesignSystem';

// local imports

// data
import costumers from './costumers';

// components
import Slider from '../../../components/Slider';

const slides = costumers.map((costumer) => {
  return (
    <article key={costumer.name}>
      {costumer.thumbnail && (
        <div>
          <Image
            src={costumer.thumbnail.image}
            alt={costumer.thumbnail.alt}
            sizes='(min-width: 1024px) 380px, (min-width: 768px) 42vw, calc(100vw - 64px)'
          />
          <span aria-hidden='true' />
        </div>
      )}

      <div>
        <span aria-hidden='true'>
          “
        </span>
        <blockquote>
          <p>{costumer.quote}</p>
        </blockquote>
        <footer>
          <p>{costumer.name}</p>
        {costumer.socialMedia && (
          <a
            href={costumer.socialMedia.link}
            target='_blank'
            rel='noopener noreferrer'
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
    <section className='home-stories section-shell'
      aria-labelledby='customer-stories-title'
    >
      <SectionHeading id='customer-stories-title' number='04' eyebrow='Historias de la comunidad' title='Ellos ya viven la experiencia DNAture'>
          Familias que eligieron una alimentación más natural para acompañar
          el bienestar de sus mascotas.
      </SectionHeading>

      <div>
        <Slider slides={slides} />
      </div>
    </section>
  );
};

export default OurCostumers;
