

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
    <section aria-labelledby='home-hero-title'>
      <div>
        <div>
          <HeroEyebrow />
          <HeroTitle />
          <HeroSeparator />
          <HeroParagraph />
          <HeroCta />
        </div>
        <div>
          <HeroImage />
          <div>
            <HeroBadge />
          </div>
        </div>
      </div>
      <div>
        <HeroBenefits />
      </div>
    </section>
  );
};

export default Hero;
