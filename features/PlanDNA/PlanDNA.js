import React, { useEffect, useState } from 'react';

// local imports
// models
import { Client } from '../../models/client';

// hooks
import useLocalStorage from '../../hooks/useLocalStorage';

// util
import { calculatePortionSizeInGrams } from './util';

// components
import Intro from './Intro';
import PetData from './PetData';
import PetDataResult from './PetDataResult';

import styles from './PlanDNA.module.scss';

const initialClient = new Client();

const PlanDNA = () => {
  const [step, setStep] = useState(0);
  const [client, setClient] = useLocalStorage('client', initialClient);
  const [petToEdit, setPetToEdit] = useState(null);

  useEffect(() => {
    if (client.pets && client.pets.length > 0) {
      setStep(2);
    }
  }, [client]);

  const handlePetDataSubmit = (data) => {
    const portionSize = calculatePortionSizeInGrams(data);
    data.portionSize = portionSize;

    setClient((prevClient) => {
      const updatedPets = prevClient.pets ? [...prevClient.pets] : [];
      const existingPetIndex = updatedPets.findIndex(
        (pet) => pet.name === data.name
      );

      if (existingPetIndex !== -1) {
        updatedPets[existingPetIndex] = data;
      } else {
        updatedPets.push(data);
      }

      return { ...prevClient, pets: updatedPets };
    });

    // Proceed to the next step
    setStep(2);
  };

  const addAnotherPet = () => setStep(1);

  const onEdit = (petName) => {
    setPetToEdit(client.pets.find((pet) => pet.name === petName));
    setStep(1);
  };

  const onDeletePet = (petName) => {
    setClient((prevClient) => {
      const updatedPets = prevClient.pets ? [...prevClient.pets] : [];
      const existingPetIndex = updatedPets.findIndex(
        (pet) => pet.name === petName
      );

      if (existingPetIndex !== -1) {
        updatedPets.splice(existingPetIndex, 1);
      }

      return { ...prevClient, pets: updatedPets };
    });
  };

  return (
    <div className={styles['plan-dna']}>
      {step === 0  && <Intro start={() => setStep(1)} />}
      {step === 1 && (
        <PetData
          initialPetInfo={petToEdit}
          startOver={() => setStep(0)}
          onSubmit={handlePetDataSubmit}
        />
      )}
      <div>
      {(step === 2) && (
        <PetDataResult
          onEdit={onEdit}
          onDeletePet={onDeletePet}
          petData={client.pets}
          addAnotherPet={addAnotherPet}
        />
      )}
      </div>
    </div>
  );
};

export default PlanDNA;
