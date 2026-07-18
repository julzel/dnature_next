import React, { useEffect, useState } from 'react';

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

const ensurePetIds = (pets = []) =>
  pets.map((pet) => ({ ...pet, id: pet.id || createPetId() }));

const PlanDNA = () => {
  const [step, setStep] = useState(0);
  const [client, setClient] = useLocalStorage('client', initialClient);
  const [petToEdit, setPetToEdit] = useState(null);

  useEffect(() => {
    if (client.pets && client.pets.length > 0) {
      const petsWithIds = ensurePetIds(client.pets);

      if (petsWithIds.some((pet, index) => pet.id !== client.pets[index].id)) {
        setClient((previousClient) => ({ ...previousClient, pets: petsWithIds }));
      }
      setStep(2);
    }
  }, [client, setClient]);

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
        (currentPet) => currentPet.id === pet.id
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
    setPetToEdit(client.pets.find((pet) => pet.id === petId) || null);
    setStep(1);
  };

  const onDeletePet = (petId) => {
    setClient((prevClient) => {
      const updatedPets = (prevClient.pets || []).filter((pet) => pet.id !== petId);

      return { ...prevClient, pets: updatedPets };
    });

    if (petToEdit?.id === petId) {
      setPetToEdit(null);
    }
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
