import React from 'react';
import { TextField } from '@mui/material';
import SelectInput from '../../../components/SelectInput';
import WeightInput from '../../../components/WeightInput';

const PetNameInput = ({ value, handleChange }) => (
  <TextField
    fullWidth
    label="Nombre"
    id="petName"
    variant="filled"
    value={value}
    onChange={(e) => handleChange(e.target.value)}
  />
);

const PetAgeInput = ({ value = 'adult', handleChange }) => {
  const options = [
    { value: 'adult', label: 'Adulto' },
    { value: 'puppy', label: 'Cachorro' },
  ];
  return (
    <SelectInput
      label="Edad"
      id="age-select"
      value={value}
      options={options}
      onChange={handleChange}
    />
  );
};

const PetPuppyStageInput = ({ value = 'stage1', handleChange }) => {
  const options = [
    { value: 'stage1', label: 'Etapa 1 - menor a 7 meses' },
    { value: 'stage2', label: 'Etapa 2 - 7 meses a 1 año' },
    { value: 'stage3', label: 'Etapa 3 - 1 año hasta etapa adulta' },
  ];
  return (
    <SelectInput
      label="Etapa"
      id="puppy-stage"
      value={value}
      options={options}
      onChange={handleChange}
    />
  );
};

const PetSizeInput = ({ value = 'medium', handleChange }) => {
  const options = [
    { value: 'small', label: 'Mini - menos de 4kg' },
    { value: 'medium', label: 'Pequeño/Mediano - 5kg a 25kg' },
    { value: 'large', label: 'Grande/Gigante - más de 25kg' },
  ];
  return (
    <SelectInput
      label="Tamaño"
      id="size-select"
      value={value}
      options={options}
      onChange={handleChange}
    />
  );
};

const PetIsCastratedInput = ({ value = true, handleChange }) => {
  const options = [
    { value: true, label: 'Castrado' },
    { value: false, label: 'Sin castrar' },
  ];
  return (
    <SelectInput
      label="Castración"
      id="castrated-select"
      value={value}
      options={options}
      onChange={handleChange}
    />
  );
};

const PetWeightContextureInput = ({ value = 'ideal', handleChange }) => {
  const options = [
    { value: 'underWeight', label: 'Bajo peso' },
    { value: 'ideal', label: 'Ideal' },
    { value: 'overWeight', label: 'Sobrepeso' },
  ];
  return (
    <SelectInput
      label="Contextura física"
      id="contexture-select"
      value={value}
      options={options}
      onChange={handleChange}
    />
  );
};

const PetDailyActivityInput = ({ value = 'active', handleChange }) => {
  const options = [
    { value: 'sedentary', label: 'Sedentario' },
    { value: 'active', label: 'Activo' },
    { value: 'veryActive', label: 'Deportista' },
  ];
  return (
    <SelectInput
      label="Actividad física diaria"
      id="daily-activity"
      value={value}
      options={options}
      onChange={handleChange}
    />
  );
};

const PetWeightInput = ({ weight, handleChange }) => (
  // weight, handleChange, label, helpText
  <WeightInput
    label="Peso de tu mascota"
    helpText="El peso debe estar entre 0.1kg y 100kg"
    weight={weight}
    handleChange={handleChange}
  />
);

const stepsItems = (petInfo, handleInfoChange) => [
  {
    title: 'Nombre',
    component: (
      <PetNameInput
        value={petInfo.name}
        handleChange={handleInfoChange('name')}
      />
    ),
  },
  {
    title: 'Edad',
    component: (
      <PetAgeInput value={petInfo.age} handleChange={handleInfoChange('age')} />
    ),
  },
  {
    title: 'Etapa de cachorro',
    component: (
      <PetPuppyStageInput
        value={petInfo.puppyStage}
        handleChange={handleInfoChange('puppyStage')}
      />
    ),
  },
  {
    title: 'Tamaño',
    component: (
      <PetSizeInput
        value={petInfo.size}
        handleChange={handleInfoChange('size')}
      />
    ),
  },
  {
    title: 'Castración',
    component: (
      <PetIsCastratedInput
        value={petInfo.castrated}
        handleChange={handleInfoChange('castrated')}
      />
    ),
  },
  {
    title: 'Contextura física',
    component: (
      <PetWeightContextureInput
        value={petInfo.bodyContexture}
        handleChange={handleInfoChange('bodyContexture')}
      />
    ),
  },
  {
    title: 'Actividad física diaria',
    component: (
      <PetDailyActivityInput
        value={petInfo.dailyActivity}
        handleChange={handleInfoChange('dailyActivity')}
      />
    ),
  },
  {
    title: 'Peso en kg',
    component: (
      <PetWeightInput
        value={petInfo.weight}
        handleChange={handleInfoChange('weight')}
      />
    ),
  },
];

export {
  PetAgeInput,
  PetPuppyStageInput,
  PetSizeInput,
  PetIsCastratedInput,
  PetWeightContextureInput,
  PetDailyActivityInput,
  PetNameInput,
  PetWeightInput,
  stepsItems,
};
