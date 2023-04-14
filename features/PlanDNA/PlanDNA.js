import React, { useState } from "react";

// local imports
// components
import PetInfoForm from "./PetInfoForm";
import ProteinSelection from "./ProteinSelection";
import DeliveryOptions from "./DeliveryOptions";

const PlanDnature = ({
  formData,
  updatePetData,
  updateSelectedProteins,
  updateDeliveryData,
}) => {
  switch (formData.step) {
    case 1:
      return <PetInfoForm onSubmit={updatePetData} />;
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

export default PlanDnature;
