import Link from "next/link";
import Image from "next/image";
import heroImage from "../../../public/images/hero3_wide.jpg";
import styles from "./Hero.module.scss";

const Hero = () => {
  return (
    <div className={styles.heroContainer}>
      <div className={styles.heroAction}>
        <h1 className={styles.heroActionTitle}>
          La forma <span>natural</span> de <span>alimentar</span> a tu mascota
        </h1>

        <p className={styles.heroActionParagraph}>
          Nuestra gama de recetas, snacks y suplementos, ha sido seleccionada
          con el objetivo de brindar la nutrición ideal para tu mascota, de
          acuerdo a su fisiología y su genética.
        </p>

        <div className={styles.heroActionButtons}>
          <Link href="/productos" className={styles.button}>
            Comprar
          </Link>
        </div>
      </div>
      <div className={styles.hero}>
        <Image
          src={heroImage}
          alt=""
          fill
          priority
          sizes="(min-width: 768px) 50vw, 100vw"
          className={styles.heroImage}
        />
      </div>
    </div>
  );
};

export default Hero;
