import React from "react";
import StepsFooter from "./StepsFooter";

const StepsFooterContainer = ({
  nextStep,
  prevStep,
  currentStep,
  lastStep,
  enableNext,
}) => {
  return (
    <StepsFooter
      nextStep={nextStep}
      prevStep={prevStep}
      currentStep={currentStep}
      lastStep={lastStep}
      enableNext={enableNext}
    />
  );
};

export default StepsFooterContainer;
