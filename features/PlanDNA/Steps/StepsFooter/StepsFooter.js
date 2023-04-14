import React from "react";

// local imports
// components
import Button from "../../../../components/Button";

// styles
import styles from "./StepsFooter.module.scss";

const StepsFooter = ({ nextStep, prevStep, currentStep, lastStep }) => {
  return (
    <div className={styles.stepsActions}>
      <Button
        className={`${styles.stepsButton} ${styles.variant}`}
        onClick={prevStep}
      >
        Anterior
      </Button>
      <Button className={styles.stepsButton} onClick={nextStep}>
        Siguiente
      </Button>
    </div>
  );
};

export default StepsFooter;
