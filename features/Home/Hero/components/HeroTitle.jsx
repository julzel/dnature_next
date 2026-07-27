import styles from "./HeroTitle.module.scss";

const HeroTitle = () => (
  <h1 className={styles.title}>
    <span className={styles.line}>
      La forma <span className={styles.natural}>natural</span>
    </span>
    <span className={styles.line}>de alimentar</span>
    <span className={`${styles.line} ${styles.pet}`}>a tu mascota</span>
  </h1>
);

export default HeroTitle;
