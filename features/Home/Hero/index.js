import React from 'react';

// local imports
// images
import HeroImage from '../../../public/images/hero3.jpg';

// hooks
import useWindow from '../../../hooks/useWindow';
import useCompatibleNavigation from '../../../hooks/useCompatibleNavigation';

// components
import Hero from './Hero';

const HeroContainer = () => {
  const isMobile = useWindow();
  const { push } = useCompatibleNavigation();

  // create a function to handle the click event
  const handlePlanDnaClick = (e) => {
    e.preventDefault();
    push('/plan-dnature');
  };

  const handleComprarClick = (e) => {
    e.preventDefault();
    push('/productos');
  };

  return (
    <Hero
      imageSrc={HeroImage}
      isMobile={isMobile}
      handlePlanDnaClick={handlePlanDnaClick}
      handleComprarClick={handleComprarClick}
    />
  );
};

export default HeroContainer;
