import React from 'react';
import { useRouter } from 'next/router';

// local imports
// images
import HeroImage from '../../../public/images/hero3.jpg';
// hooks
import useWindow from '../../../hooks/useWindow';
// components
import Hero from './Hero';

const HeroContainer = () => {
  const isMobile = useWindow();
  const router = useRouter();

  // create a function to handle the click event
  const handlePlanDnaClick = (e) => {
    e.preventDefault();
    router.push('/plan-dnature');
  };

  return (
    <Hero
      imageSrc={HeroImage}
      isMobile={isMobile}
      handlePlanDnaClick={handlePlanDnaClick}
    />
  );
};

export default HeroContainer;
