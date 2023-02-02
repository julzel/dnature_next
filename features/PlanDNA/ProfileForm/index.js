import React, { useState } from 'react';

import ProfileForm from './ProfileForm';

const ProfileFormContainer = () => {
  const [step, setStep] = useState(1);
  const [dogProfile, setDogProfile] = useState({
    name: '',
    age: 0,
    weight: 0,
    size: 'Pequeño',
    contexture: 'Normal',
    activity: 'Activo',
    breed: '',
    castrated: false,
    portionSize: undefined,
  });

  const handleInputChange = (event) => {
    const { type, name, value } = event.target;

    setDogProfile({
      ...dogProfile,
      [name]: type === 'number' ? Number(value) : value,
    });
  };

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;

    setDogProfile({
      ...dogProfile,
      [name]: checked,
    });
  };

  const handleNext = () => {
    console.log({ dogProfile });
    if (step === 3) return;
    setStep(step + 1);
  };

  const handlePrevious = () => {
    if (step === 1) return;
    setStep(step - 1);
  };

  return (
    <ProfileForm
      step={step}
      handleInputChange={handleInputChange}
      handleCheckboxChange={handleCheckboxChange}
      handleNext={handleNext}
      handlePrevious={handlePrevious}
      profile={dogProfile}
    />
  );
};

export default ProfileFormContainer;
