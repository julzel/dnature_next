

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
    <section className='home-hero' aria-labelledby='home-hero-title'>
      <div className='hero-layout'>
        <div className='hero-copy'>
          <HeroEyebrow />
          <HeroTitle />
          <HeroSeparator />
          <HeroParagraph />
          <HeroCta />
        </div>
        <div className='hero-art'>
          <HeroImage />
          <div className='hero-badge'>
            <HeroBadge />
          </div>
        </div>
      </div>
      <div className='hero-benefits'>
        <HeroBenefits />
      </div>
    </section>
  );
};

export default Hero;
