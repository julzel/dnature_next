import React from 'react';
import { Button } from '@mui/material';
import PetCard from '../../../components/PetCard';

const PetDataResult = ({ petData, addAnotherPet }) => {
  return (
    <div>
      {petData.map((pet, index) => (
        <PetCard key={index} petInfo={pet} />
      ))}
      <button onClick={addAnotherPet}>Add Another Pet</button>
    </div>
  );
};

export default PetDataResult;
