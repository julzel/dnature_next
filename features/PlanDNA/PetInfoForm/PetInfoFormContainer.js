import React, { useState, useCallback } from "react";
import PetInfoForm from "./PetInfoForm";

const PetInfoFormContainer = ({ onSubmit }) => {
  const [petData, setPetData] = useState({
    name: "",
    age: "adulto",
    size: "",
    weight: "",
    castrated: "",
    weightStatus: "",
    activity: "",
    stage: "",
  });

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

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setPetData((prevData) => ({ ...prevData, [name]: value }));
  }, []);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      onSubmit(petData);
      setPetData({
        name: "",
        age: "",
        size: "",
        weight: "",
        castrated: "",
        weightStatus: "",
        activity: "",
        stage: "",
      });
    },
    [onSubmit, petData]
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
