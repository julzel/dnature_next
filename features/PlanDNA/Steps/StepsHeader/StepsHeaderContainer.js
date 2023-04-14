import React from "react";
import StepsHeader from "./StepsHeader";

const StepsHeaderContainer = ({ setStep, currentStep, steps }) => {
  return (
    <StepsHeader setStep={setStep} currentStep={currentStep} steps={steps} />
  );
};

export default StepsHeaderContainer;
