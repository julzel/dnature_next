import React, { useState, useCallback } from "react";
import PetInfoForm from "./PetInfoForm";

const ageOptions = [
  {
    value: "adulto",
    label: "Adulto",
  },
  {
    value: "cachorro",
    label: "Cachorro",
  },
];

const initialPetData = {
  name: "",
  age: "adulto",
  size: "medium",
  weight: 0,
  castrated: "castrated",
  weightStatus: "ideal",
  activity: "active",
  stage: "stage3",
};

const PetInfoFormContainer = ({ onAddPetData }) => {
  const [petData, setPetData] = useState(initialPetData);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setPetData((prevData) => ({ ...prevData, [name]: value }));
  }, []);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      console.log(petData);
      onAddPetData(petData);
      // setPetData(initialPetData);
    },
    [onAddPetData, petData]
  );

  return (
    <PetInfoForm
      petData={petData}
      ageOptions={ageOptions}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
    />
  );
};

export default PetInfoFormContainer;
