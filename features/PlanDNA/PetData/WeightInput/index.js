import { useId } from 'react';
import { isValidPetWeight } from '../../../../util/portion-size';

const WeightInput = ({ weight, handleChange, label, helpText }) => {
  const id = useId();
  const error = String(weight).trim() !== '' && !isValidPetWeight(weight);

  return (
    <div className='field'>
      <label htmlFor={id}>{label}</label>{' '}
      <input
        id={id}
        required
        type='text'
        inputMode='decimal'
        value={weight}
        onChange={(event) => handleChange(event.target.value)}
        aria-invalid={error || undefined}
        aria-describedby={error ? `${id}-error` : undefined}
      />{' '}
      <span>kg</span>
      {error && <p id={`${id}-error`} role='alert'>{helpText}</p>}
    </div>
  );
};

export default WeightInput;
