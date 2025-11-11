'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

// local imports
// images
import HeroImage from '../../../public/images/hero3.avif';

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

  const handleComprarClick = (e) => {
    e.preventDefault();
    router.push('/productos');
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
