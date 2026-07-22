
import styles from "./Hero.module.scss";
import HeroCta from './HeroCta';
import HeroEyebrow from "./HeroEyebrow";
import HeroTitle from "./HeroTitle";
import HeroSeparator from "./HeroSeparator";
import HeroParagraph from "./HeroParagraph";

const Hero = () => {
  return (
    <div className={styles.heroContainer}>
      <div className={styles.heroSectionA}>
        <HeroEyebrow />
        <HeroTitle />
        <HeroSeparator />
        <HeroParagraph />
        <HeroCta />
      </div>
      <div className={styles.heroSectionB}></div>
    </div>
  );
};

export default Hero;
