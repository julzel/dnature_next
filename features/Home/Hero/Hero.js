
import styles from "./Hero.module.scss";
import HeroCta from './components/HeroCta';
import HeroEyebrow from "./components/HeroEyebrow";
import HeroTitle from "./components/HeroTitle";
import HeroSeparator from "./components/HeroSeparator";
import HeroParagraph from "./components/HeroParagraph";
import HeroBadge from "./components/HeroBadge";
import HeroImage from './components/HeroImage';
import HeroBenefits from "./components/HeroBenefits";

const Hero = () => {
  return (
    <section className={styles.hero} aria-labelledby='home-hero-title'>
      <div className={styles.heroContainer}>
        <div className={styles.heroContent}>
          <HeroEyebrow />
          <HeroTitle />
          <HeroSeparator />
          <HeroParagraph />
          <HeroCta />
        </div>
        <div className={styles.heroVisual}>
          <HeroImage />
          <div className={styles.heroBadge}>
            <HeroBadge />
          </div>
        </div>
      </div>
      <div className={styles.heroBenefits}>
        <HeroBenefits />
      </div>
    </section>
  );
};

export default Hero;
