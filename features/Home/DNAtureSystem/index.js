import Image from 'next/image';
import { ArrowRight, Check } from 'lucide-react';

import Button from '../../../components/Button';
import styles from './DNAtureSystem.module.scss';
import benefits from './benefits';
import planImage from '../../../public/images/plandna-mobile.jpg';

const systemFeatures = [
  'Ingredientes naturales y proteína de calidad',
  'Porciones adaptadas a las necesidades de tu mascota',
  'Acompañamiento para incorporar su alimentación',
];

const DNAtureSystem = () => {
  return (
    <section
      className={styles.dnatureSystem}
      aria-labelledby='dnature-system-title'
    >
      <div className={styles.container}>
        <div className={styles.introduction}>
          <div className={styles.imageFrame}>
            <Image
              src={planImage}
              alt='Selección de ingredientes naturales utilizados por DNAture'
              fill
              sizes='(min-width: 1024px) 46vw, calc(100vw - 32px)'
              className={styles.image}
            />
            <span className={styles.imageLabel}>Nutrición real</span>
          </div>

          <div className={styles.introductionContent}>
            <p className={styles.eyebrow}>El sistema DNAture</p>
            <h2 id='dnature-system-title'>Una alimentación pensada para su bienestar</h2>
            <p className={styles.lead}>
              Te ayudamos a incorporar alimentación natural de una forma
              sencilla, con productos frescos y una porción adecuada para tu
              mascota.
            </p>

            <ul className={styles.features}>
              {systemFeatures.map((feature) => (
                <li key={feature}>
                  <span className={styles.check} aria-hidden='true'>
                    <Check size={16} strokeWidth={3} />
                  </span>
                  {feature}
                </li>
              ))}
            </ul>

            <div className={styles.actions}>
              <Button
                href='/calculadora'
                size='large'
                iconEnd={<ArrowRight size={18} aria-hidden='true' />}
              >
                Calculá su porción
              </Button>
              <Button href='/plan-dnature' variant='tertiary' size='large'>
                Conocé el plan DNAture
              </Button>
            </div>
          </div>
        </div>

        <div className={styles.benefitsHeading}>
          <p className={styles.eyebrow}>Bienestar integral</p>
          <h3 id='dnature-benefits-title'>Beneficios que buscamos acompañar</h3>
          <p>
            Cada mascota es diferente. Su alimentación debe considerar su
            etapa de vida, condición corporal y necesidades particulares.
          </p>
        </div>

        <ol
          className={styles.benefits}
          aria-labelledby='dnature-benefits-title'
        >
          {benefits.map((benefit, index) => (
            <li key={benefit.title} className={styles.benefit}>
              <span className={styles.benefitNumber} aria-hidden='true'>
                {String(index + 1).padStart(2, '0')}
              </span>
              <h4>{benefit.title}</h4>
              <p>{benefit.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default DNAtureSystem;
