import React, { useState } from 'react';

// local imports
// models
import { Client } from '../../models/client';

// hooks
import useLocalStorage from '../../hooks/useLocalStorage';

// util
import { calculatePortionSizeInGrams } from '../../util/portion-size';

// components
import Intro from './Intro';
import PetData from './PetData';
import PetDataResult from './PetDataResult';

import styles from './PlanDNA.module.scss';

const initialClient = new Client();

const createPetId = () =>
  globalThis.crypto?.randomUUID?.() ||
  `pet-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

const getPetId = (pet, index) => pet.id || `legacy-pet-${index}`;

const PlanDNA = () => {
  const [step, setStep] = useState(0);
  const [client, setClient] = useLocalStorage('client', initialClient);
  const [petToEdit, setPetToEdit] = useState(null);

  const pets = client.pets || [];
  const visibleStep = step === 0 && pets.length > 0 ? 2 : step;
  const petsForDisplay = pets.map((pet, index) => ({ ...pet, id: getPetId(pet, index) }));

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
      const updatedPets = prevClient.pets ? [...prevClient.pets] : [];
      const existingPetIndex = updatedPets.findIndex(
        (currentPet, index) => getPetId(currentPet, index) === pet.id
      );

      if (existingPetIndex !== -1) {
        updatedPets[existingPetIndex] = pet;
      } else {
        updatedPets.push(pet);
      }

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
    const petIndex = pets.findIndex((pet, index) => getPetId(pet, index) === petId);
    setPetToEdit(petIndex === -1 ? null : { ...pets[petIndex], id: petId });
    setStep(1);
  };

  const onDeletePet = (petId) => {
    setClient((prevClient) => {
      const updatedPets = (prevClient.pets || []).filter(
        (pet, index) => getPetId(pet, index) !== petId
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
          petData={petsForDisplay}
          addAnotherPet={addAnotherPet}
        />
      )}
      </div>
    </div>
  );
};

export default PlanDNA;
