import React from 'react';
import Carousel from 'react-material-ui-carousel';
import { Button, Typography } from '@mui/material';
import styles from './PetData.module.scss';

// components
import { stepsItems } from './questions';

const petDefaultInfo = {
  name: '',
  age: 'adult',
  puppyStage: 'stage1',
  size: 'medium',
  castrated: true,
  bodyContexture: 'ideal',
  dailyActivity: 'active',
  weight: 0,
};

const PetData = ({ initialPetInfo = petDefaultInfo, onSubmit, startOver }) => {
  const [currentStep, setCurrentStep] = React.useState(0);
  const [petInfo, setPetInfo] = React.useState(initialPetInfo);

  const handleInfoChange = (field) => (value) => {
    setPetInfo((prevInfo) => ({ ...prevInfo, [field]: value }));
  };

  const steps = stepsItems(petInfo, handleInfoChange);

  const onNextStep = () => {
    if (currentStep >= steps.length - 1) {
      onSubmit(petInfo);
    } else if (currentStep === 1 && petInfo.age === 'adult') {
      setCurrentStep(3);
    } else if (currentStep === 2) {
      setCurrentStep(7);
    } else {
      setCurrentStep(currentStep + 1);
    }
  };
  

  const onPrevStep = () => {
    if (currentStep > 0) {
      if (currentStep === 7) {
        if (petInfo.age === 'puppy') {
          setCurrentStep(2);
        } else {
          setCurrentStep(3);
        }
      } else if (currentStep === 3 && petInfo.age === 'adult') {
        setCurrentStep(1);
      } else {
        setCurrentStep(currentStep - 1);
      }
    } else {
      startOver();
    }
  };

  const isStepComplete = () => {
    switch (currentStep) {
      case 0:
        return !!petInfo.name;
      case 7:
        return !!petInfo.weight;
      default:
        return true;
    }
  };

  return (
    <div className={styles['pet-data']}>
      <div className={styles['steps-carousel']}>
        <Carousel
          animation="slide"
          autoPlay={false}
          indicators={false}
          navButtonsAlwaysInvisible={true}
          index={currentStep}
          height={150}
        >
          {steps.map((item, i) => (
            <div key={`item-${i}`} className={styles['step-item']}>
              <h2 className={styles['step-item_title']}>{item.title}</h2>
              {item.component}
            </div>
          ))}
        </Carousel>
      </div>
      <div className={styles['steps-navigation']}>
        <Button onClick={onPrevStep} variant="outlined">
          Anterior
        </Button>
        <Button
          onClick={onNextStep}
          disabled={!isStepComplete()}
          variant="contained"
          disableElevation
        >
          Siguiente
        </Button>
      </div>
    </div>
  );
};

export default PetData;
