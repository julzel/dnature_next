import React, { useState } from "react";

// local imports
// components
import PetInfoFormContainer from "./PetInfoForm";
import ProteinSelection from "./ProteinSelection";
import DeliveryOptions from "./DeliveryOptions";

const PlanDNA = ({
  formData,
  updatePetsData,
  updateSelectedProteins,
  updateDeliveryData,
}) => {
  switch (formData.step) {
    case 1:
      return (
        <PetInfoFormContainer
          onAddPetData={(data) => {
            console.log(data);
            updatePetsData(data);
          }}
        />
      );
    case 2:
      return (
        <ProteinSelection
          updateSelectedProteins={updateSelectedProteins}
          selectedProteins={formData.selectedProteins}
        />
      );
    case 3:
      return (
        <DeliveryOptions
          updateDeliveryData={updateDeliveryData}
          deliveryData={formData.deliveryData}
        />
      );
    default:
      return <h1>Algo salió mal. Por favor, inténtalo de nuevo.</h1>;
  }
};

export default PlanDNA;
