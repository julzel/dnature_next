import React, { useState, useEffect } from 'react';
import Intro from './Intro';
import PetData from './PetData';
import PetDataResult from './PetDataResult';

import styles from './PlanDNA.module.scss';

const PlanDNA = () => {
  const [step, setStep] = useState(0);
  const [petData, setPetData] = useState(null);

  // Check local storage when component mounts
  useEffect(() => {
    const clientData = localStorage.getItem('client');
    if (clientData && JSON.parse(clientData).pets.length > 0) {
      setPetData(JSON.parse(clientData).pets);
      setStep(2);
    }
  }, []);

  const start = () => setStep(1)

  const handlePetDataSubmit = (data) => {
    // Save data to state and local storage
    const clientData = JSON.parse(localStorage.getItem('client'));
    clientData.pets = [...clientData.pets, data];
    localStorage.setItem('client', JSON.stringify(clientData));
    setPetData(clientData.pets);
    
    // Proceed to the next step
    setStep(2);
  };

  const addAnotherPet = () => {
    setStep(1);
  };

  return (
    <div className={styles['plan-dna']}>
      {step === 0 && <Intro start={start} />}
      {step === 1 && <PetData startOver={start} onSubmit={handlePetDataSubmit} />}
      {step === 2 && <PetDataResult petData={petData} addAnotherPet={addAnotherPet} />}
    </div>
  );
};

export default PlanDNA;
