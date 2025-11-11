import React from 'react';
import Image from 'next/image';

// local imports
// styles
import styles from './DNAtureSystem.module.scss';

// data
import benefits from './benefits';

// images
import PlanDnaMobile from '../../../public/images/plandna-mobile.avif';
import PlanDnaDesk from '../../../public/images/plandna-desk.avif';

const PlanSteps = () => {
  return (
    <>
      <section className={styles.dnatureSystem}>
        <div className={styles.dnaturePlate}>
          <Image
            src={PlanDnaMobile}
            alt="DNAture Plan - Alimentación personalizada"
            fill
            className={styles.backgroundImage}
            quality={85}
            sizes="(max-width: 768px) 100vw, 100vw"
            priority={false}
          />
          <div className={styles.content}>
            <h3>¡Transforma la vida de tu mascota!</h3>
            <ul>
              <li>Proteína cruda de alta calidad</li>
              <li>Nutrientes esenciales para una vida sana</li>
              <li>Menús personalizados para cada peludo amigo</li>
              <li>Servicio a domicilio: ¡comodidad y frescura garantizada!</li>
            </ul>

            <h4>¡Regala salud y felicidad a tu mejor amigo!</h4>
          </div>
        </div>

        <div className={styles.benefits}>
          {benefits.map((benefit, i) => (
            <div key={i} className={styles.benefit}>
              <h3>
                <span>{benefit.title}</span>
              </h3>
              <p>{benefit.text}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default PlanSteps;
