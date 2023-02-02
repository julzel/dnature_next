import { useEffect } from 'react';
import useSmoothAnimatedScrollToTop from '../../../hooks/useScrollTop';
import {
  NameInput,
  AgeInput,
  WeightInput,
  SizeInput,
  ActivityInput,
  ContextureInput,
  CastratedInput,
  Action,
} from './ProfileComponents';

import styles from './ProfileForm.module.scss';

const ProfileForm = ({
  step,
  handleInputChange,
  handleCheckboxChange,
  handleNext,
  profile,
}) => {
  useSmoothAnimatedScrollToTop(step);

  switch (step) {
    case 1:
      return (
        <div className={styles.stepContainer}>
          <h2>1. Información Básica</h2>
          <NameInput onChange={handleInputChange} />
          <AgeInput onChange={handleInputChange} />
          <WeightInput onChange={handleInputChange} />
          <Action
            action={handleNext}
            text='Siguiente'
            disabled={!profile.name || !profile.age || !profile.weight}
          />
        </div>
      );
    case 2:
      return (
        <div className={styles.stepContainer}>
          <h2>2: Características</h2>
          <SizeInput onChange={handleInputChange} />
          <CastratedInput
            onChange={handleCheckboxChange}
            checked={profile.castrated}
          />
          <Action
            action={handleNext}
            text='Siguiente'
            disabled={!profile.size}
          />
        </div>
      );
    case 3:
      return (
        <div className={styles.stepContainer}>
          <h2>3: Estilo de vida</h2>
          <ActivityInput onChange={handleInputChange} />
          <ContextureInput onChange={handleInputChange} />
          <Action
            action={handleNext}
            text='Siguiente'
            disabled={!profile.activity || !profile.contexture}
          />
        </div>
      );
    case 4:
      return (
        <div className={styles.stepContainer}>
          <h2>Step 4: Portion Size</h2>
          <p>Portion size will be calculated based on the previous inputs</p>
          <button
            onClick={() => {
              // logic to calculate portion size based on the profile inputs
              // setDogProfile({...profile, portionSize: calculatedSize})
            }}
          >
            Calculate Portion Size
          </button>
        </div>
      );
    default:
      return <div>Finished!</div>;
  }
};

export default ProfileForm;
