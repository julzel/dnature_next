import React, { useState } from 'react';

// local imports
// models
import { Client } from '../../models/client';

// hooks
import useLocalStorage from '../../hooks/useLocalStorage';

// util
import { calculatePortionSizeInGrams } from '../../util/portion-size';
import {
  createPetId,
  normalizeClientPets,
  normalizePets,
} from '../../util/pets';

// components
import Intro from './Intro';
import PetData from './PetData';
import PetDataResult from './PetDataResult';

import styles from './PlanDNA.module.scss';

const initialClient = new Client();

const PlanDNA = () => {
  const [step, setStep] = useState(0);
  const [client, setClient] = useLocalStorage(
    'client',
    initialClient,
    normalizeClientPets
  );
  const [petToEdit, setPetToEdit] = useState(null);

  const pets = normalizePets(client.pets);
  const visibleStep = step === 0 && pets.length > 0 ? 2 : step;

  const handlePetDataSubmit = (data) => {
    const portionSize = calculatePortionSizeInGrams(data);

    if (!portionSize) {
      return;
    }

    const pet = {
      ...data,
      id: data.id || petToEdit?.id || createPetId(),
      portionSize,
    };

    setClient((prevClient) => {
      const currentPets = normalizePets(prevClient.pets);
      const existingPetIndex = currentPets.findIndex(
        (currentPet) => currentPet.id === pet.id
      );

      const updatedPets =
        existingPetIndex === -1
          ? [...currentPets, pet]
          : currentPets.map((currentPet, index) =>
              index === existingPetIndex ? pet : currentPet
            );

      return { ...prevClient, pets: updatedPets };
    });

    setPetToEdit(null);
    setStep(2);
  };

  const addAnotherPet = () => {
    setPetToEdit(null);
    setStep(1);
  };

  const onEdit = (petId) => {
    const petIndex = pets.findIndex((pet) => pet.id === petId);
    setPetToEdit(petIndex === -1 ? null : { ...pets[petIndex], id: petId });
    setStep(1);
  };

  const onDeletePet = (petId) => {
    setClient((prevClient) => {
      const updatedPets = normalizePets(prevClient.pets).filter(
        (pet) => pet.id !== petId
      );

      return { ...prevClient, pets: updatedPets };
    });

    if (petToEdit?.id === petId) {
      setPetToEdit(null);
    }
  };

  return (
    <div className={styles['plan-dna']}>
      {visibleStep === 0 && <Intro start={() => setStep(1)} />}
      {visibleStep === 1 && (
        <PetData
          initialPetInfo={petToEdit}
          startOver={() => setStep(0)}
          onSubmit={handlePetDataSubmit}
        />
      )}
      <div>
      {visibleStep === 2 && (
        <PetDataResult
          onEdit={onEdit}
          onDeletePet={onDeletePet}
          petData={pets}
          addAnotherPet={addAnotherPet}
        />
      )}
      </div>
    </div>
  );
};

export default PlanDNA;
