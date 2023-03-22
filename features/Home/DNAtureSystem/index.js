import React from "react";
import { useRouter } from "next/router";

// local imports
// styles
import styles from "./DNAtureSystem.module.scss";

// data
import benefits from "./benefits";
import DNAturePlanSteps from "./dnature-plan-steps";

// components
import Button from "../../../components/Button";

const PlanSteps = () => {
  const router = useRouter();
  
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
                router.push("/plan-dnature");
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
      </section>
    </>
  );
};

export default PlanSteps;
