import React from "react";

const StepsHeader = ({ setStep, currentStep, steps }) => {
  return (
    <header className="steps-header">
      <nav>
        {steps.map((step, index) => (
          <button
            key={index}
            className={`step${currentStep === index + 1 ? " active" : ""}`}
            onClick={() => setStep(index + 1)}
          >
            {step}
          </button>
        ))}
      </nav>
    </header>
  );
};

export default StepsHeader;
