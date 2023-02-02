import React, { useEffect, useState } from 'react';
// local imports
// components
import PlanIntro from './Intro';
import PlanProfile from './ProfileForm';

const PlanDNAContainer = () => {
  const [hasStarted, setHasStarted] = useState(false);
  const [hasFinished, setHasFinished] = useState(false);

  const handleStartClick = (event) => {
    event.preventDefault();
    setHasStarted(true);
  };

  const handleFinishClick = (event) => {
    event.preventDefault();
    setHasFinished(true);
  };

  if (!hasStarted) {
    return <PlanIntro handleStartClick={handleStartClick} />;
  } else if (hasStarted && !hasFinished) {
    return <PlanProfile handleFinichClick={handleFinishClick} />;
  } else {
    return null;
  }
};

export default PlanDNAContainer;
