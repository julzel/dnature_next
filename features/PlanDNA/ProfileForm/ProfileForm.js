import useSmoothAnimatedScrollToTop from '../../../hooks/useScrollTop';
import {
  NameInput,
  AgeInput,
  WeightInput,
  SizeInput,
  ActivityInput,
  ContextureInput,
  CastratedInput,
  BreedInput,
  Action,
} from './ProfileComponents';

import styles from './ProfileForm.module.scss';

const ProfileForm = ({
  step,
  handleInputChange,
  handleCheckboxChange,
  handleStartOverClick,
  handleNext,
  profile,
  breeds,
}) => {
  useSmoothAnimatedScrollToTop(step);

  const getStep = (step) => {
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
              goBack={handleStartOverClick}
            />
          </div>
        );
      case 2:
        return (
          <div className={styles.stepContainer}>
            <h2>2: Características</h2>
            <BreedInput onChange={handleInputChange} breeds={breeds} />
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
  }

  return (
    <div className={styles.stepSection}>
      {getStep(step)}
    </div>
  )
};

export default ProfileForm;
