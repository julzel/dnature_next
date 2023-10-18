import React, { useState } from 'react';
import { Typography } from '@mui/material';

// local imports
// styles
import styles from './DNAtureSystem.module.scss';

// data
import benefits from './benefits';

// components
import CursiveTitle from '../../../components/CursiveTitle';

const PlanSteps = () => (
  <>
    <section className={styles.dnatureSystem}>
      <div className={styles.benefits}>
        <CursiveTitle>Beneficios</CursiveTitle>
        <div>
          {benefits.map((benefit, i) => (
            <div key={i}>
              <h3>
                <span>{benefit.title}</span>
              </h3>
              <p>{benefit.text}</p>
            </div>
          ))}
        </div>
      </div>
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
    </section>
  </>
);

export default PlanSteps;
