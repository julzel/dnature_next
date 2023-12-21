import React from 'react';

// local imports
// styles
import styles from './DNAtureSystem.module.scss';

// data
import benefits from './benefits';

const PlanSteps = () => {
  return (
    <>
      <section className={styles.dnatureSystem}>
        <div className={styles.dnaturePlate}>
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
