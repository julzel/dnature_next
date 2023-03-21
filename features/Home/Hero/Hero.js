import React from "react";
// import ResponsiveImage from '../../../components/ResponsiveImage';
import Button from "../../../components/Button";
import styles from "./Hero.module.scss";

const Hero = ({ handlePlanDnaClick, handleComprarClick }) => {
  return (
    <div className={styles.heroContainer}>
      <h1 className="seo-hidden">
        Alimentación natural y dieta cruda para mascotas
      </h1>
      <div className={styles.heroAction}>
        <h2 className={styles.heroActionTitle}>
          La forma <span>natural</span>de <span>alimentar</span> a tu mascota
        </h2>

        <p className={styles.heroActionParagraph}>
          Nuestra gama de recetas, snacks y suplementos, ha sido seleccionada
          con el objetivo de brindar la nutrición ideal para tu mascota, de
          acuerdo a su fisiología y su genética.
        </p>

        <div className={styles.heroActionButtons}>
          <Button
            text={"Plan DNA"}
            className={`${styles.button} ${styles.variant}`}
            onClick={handlePlanDnaClick}
          />
          <Button
            text={"Comprar"}
            className={styles.button}
            onClick={handleComprarClick}
          />
        </div>
      </div>
      <div className={styles.hero}>
        <div className={styles.heroImg} />
      </div>
    </div>
  );
};

export default Hero;
