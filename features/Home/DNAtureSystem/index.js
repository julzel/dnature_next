import React, { useState } from "react";

// local imports
// styles
import styles from "./DNAtureSystem.module.scss";

// data
import benefits from "./benefits";
import DNAturePlanSteps from "./dnature-plan-steps";

// components
import Button from "../../../components/Button";
import ModalContainer from "../../../components/Modal";

const PlanSteps = () => {
  const [displayModal, setDisplayModal] = useState(false);

  return (
    <>
      <section className={styles.dnatureSystem}>
        <div className={styles.steps}>
          <h2 className={`title ${styles.title}`}>Plan de alimentación</h2>
          <div className={styles.dnatureSystemContainer}>
            {DNAturePlanSteps.map((step, i) => (
              <div key={i}>
                <h3>
                  <span>{step.title}</span>
                </h3>
                <p>{step.text}</p>
              </div>
            ))}
          </div>
          <div className={styles.action}>
            <Button
              className={styles.button}
              onClick={(e) => {
                e.preventDefault();
                setDisplayModal(true);
              }}
            >
              Conocer más
            </Button>
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
        <div className={styles.benefits}>
          <h2 className={`title ${styles.title}`}>Beneficios</h2>
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
        {displayModal && (
          <ModalContainer closeModal={() => setDisplayModal(false)}>
            <div className={styles.planInfo}>
              <h2>¡Gracias por tu interés!</h2>
              <p>
                Queremos informarte que nuestro servicio de PLAN DNA únicame
                está disponible a través de nuestro WhatsApp, por el momento.
              </p>

              <p>
                Trabajamos arduamente para implementar esta función en nuestro
                sitio web lo antes posible para que puedas acceder a este y
                otros servicios de forma aún más conveniente y fácil.
              </p>

              <p>
                Por favor, no dude en contactarnos a través de WhatsApp si tiene
                alguna pregunta o necesita ayuda. ¡Estamos aquí para ayudarte
                con todo lo relacionado a la nutrición de tus mascotas!
              </p>

              <div>
                <a
                  href={`https://api.whatsapp.com/send?phone=50671732328&text=Deseo información sobre el plan de alimentación DNAture.`}
                >
                  <span>Contáctanos</span>
                </a>
              </div>
            </div>
          </ModalContainer>
        )}
      </section>
    </>
  );
};

export default PlanSteps;
