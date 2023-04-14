import React from "react";

// local imports
// components
import Button from "../../../components/Button";

// styles
import styles from "./Intro.module.scss";

const Intro = ({ start }) => {
  return (
    <div className={styles.intro}>
      <h1>Nutrición completa</h1>
      <p>
        ¡Hola! Nos alegra verte por aquí, explorando nuestras opciones de comida
        natural para mascotas. Sabemos que tu amigo peludo es especial y se
        merece lo mejor. Por eso, queremos ayudarte a crear un plan
        personalizado que se adapte perfectamente a sus necesidades y gustos.
      </p>

      <p>
        A continuación te pediremos que nos cuentes un poco más sobre tu
        mascota. Esta información es muy importante para nosotros, ya que nos
        ayudará a crear un plan de alimentación personalizado que se adapte a
        sus necesidades y gustos.
      </p>

      <p>
        Estamos contentos de que hayas decidido explorar nuestras soluciones
        personalizadas para el bienestar de tu mascota. Juntos, trabajaremos
        para mejorar su salud y calidad de vida. ¡Empecemos a conocer mejor a tu
        mascota!
      </p>

      <Button onClick={start}>Comenemos!</Button>
    </div>
  );
};

export default Intro;
