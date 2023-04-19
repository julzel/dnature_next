import React from "react";
import Steps from "./Steps";

const StepsContainer = ({
  children,
  nextStep,
  prevStep,
  setStep,
  currentStep,
  steps,
  enableNext,
}) => {
  return (
    <Steps
      nextStep={nextStep}
      prevStep={prevStep}
      setStep={setStep}
      currentStep={currentStep}
      steps={steps}
      enableNext={enableNext}
    >
      {children}
    </Steps>
  );
};

export default StepsContainer;
