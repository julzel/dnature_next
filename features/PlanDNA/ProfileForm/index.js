import React, { useState, useEffect } from 'react';

import ProfileForm from './ProfileForm';

const ProfileFormContainer = ({ handleStartOverClick }) => {
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
  const [step, setStep] = useState(1);
  const [breeds, setBreeds] = useState([]);

  const fetchBreeds = () => {
    return fetch('/data/razas.json')
      .then((response) => response.json())
      .then((data) => {
        const breeds = [...data.breeds];
        setBreeds(breeds);
        console.log({ breeds });
        return breeds;
      });
  };

  useEffect(() => {
    fetchBreeds();
  }, []);

  const handleInputChange = (event) => {
    if (event.target) {
      const { type, name, value } = event.target;
      setDogProfile({
        ...dogProfile,
        [name]: type === 'number' ? Number(value) : value,
      });
    } else {
      setDogProfile({
        ...dogProfile,
        breed: event,
      });
    }
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
    if (step === 4) return;
    setStep(step + 1);
  };

  const handlePrevious = () => {
    if (step === 1) return;
    setStep(step - 1);
  };

  return (
    <ProfileForm
      step={step}
      handleStartOverClick={handleStartOverClick}
      handleInputChange={handleInputChange}
      handleCheckboxChange={handleCheckboxChange}
      handleNext={handleNext}
      handlePrevious={handlePrevious}
      profile={dogProfile}
      breeds={breeds}
    />
  );
};

export default ProfileFormContainer;
