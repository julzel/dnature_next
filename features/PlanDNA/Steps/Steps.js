import React from "react";

// local imports
// components
import StepsHeaderContainer from "./StepsHeader";
import StepsFooterContainer from "./StepsFooter";

const Steps = ({
  children,
  nextStep,
  prevStep,
  setStep,
  currentStep,
  steps,
}) => {
  return (
    <div>
      <StepsHeaderContainer
        setStep={setStep}
        currentStep={currentStep}
        steps={steps}
      />
      {children}
      <StepsFooterContainer
        nextStep={nextStep}
        prevStep={prevStep}
        currentStep={currentStep}
        lastStep={steps.length}
      />
    </div>
  );
};

export default Steps;
