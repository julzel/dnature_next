import React from "react";
import StepsFooter from "./StepsFooter";

const StepsFooterContainer = ({
  nextStep,
  prevStep,
  currentStep,
  lastStep,
}) => {
  return (
    <StepsFooter
      nextStep={nextStep}
      prevStep={prevStep}
      currentStep={currentStep}
      lastStep={lastStep}
    />
  );
};

export default StepsFooterContainer;
