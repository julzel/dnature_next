
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
    <section className={styles.hero}>
      <div className={styles.heroContainer}>
        <div className={styles.heroSectionA}>
          <HeroEyebrow />
          <HeroTitle />
          <HeroSeparator />
          <HeroParagraph />
          <HeroCta />
        </div>
        <div className={styles.heroSectionB}>
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
