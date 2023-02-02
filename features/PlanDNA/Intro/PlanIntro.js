import React from 'react';

// local imports
// components
import PlanButton from '../PlanButton';

// styles
import styles from './PlanIntro.module.scss';

const PlanIntro = ({ handleStartClick }) => {
  return (
    <div className={styles.planDNAContainer}>
      <h1>¡La mejor alimentación natural para tu mascota hecha FÁCIL!</h1>
      <p>
        Estamos emocionados de ofrecerte un plan de alimentación natural por
        suscripción para tu compañero. Sabemos lo importante que es para ti
        proporcionar la mejor alimentación posible para tu mascota, y estamos
        aquí para ayudarte.
      </p>
      <p>
        ¿Quieres darle lo mejor a tu mascota? Solo responde unas pocas preguntas
        rápidas sobre tu mascota y deja que creamos un plan de alimentación a la
        medida. ¡Tu mascota merece lo mejor y con DNAture nunca ha sido tan
        fácil brindárselo!
      </p>
      <div>
        <PlanButton text='¡Comencemos!' onClick={handleStartClick} />
      </div>
    </div>
  );
};

export default PlanIntro;
