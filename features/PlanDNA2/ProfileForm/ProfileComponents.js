// local imports
// components
import {
  Input,
  Select,
  Checkbox,
  FilterableSelect,
} from '../../../components/Form';
import PlanButton from '../PlanButton';
// styles
import styles from './ProfileComponents.module.scss';

const NameInput = ({ onChange }) => (
  <Input
    label='Nombre'
    name='name'
    type='text'
    onChange={onChange}
    className={styles.formInput}
    placeholder='nombre del perro'
  />
);

const WeightInput = ({ onChange }) => (
  <Input
    label='Peso'
    name='weight'
    type='number'
    onChange={onChange}
    className={styles.formInput}
    placeholder='peso del perro en kilogramos'
  />
);

const AgeInput = ({ onChange }) => (
  <Input
    label='Edad'
    name='age'
    type='number'
    onChange={onChange}
    className={styles.formInput}
    placeholder='edad del perro en años'
  />
);

const SizeInput = ({ onChange }) => (
  <Select
    label='Tamaño'
    name='size'
    onChange={onChange}
    options={['Miniatura', 'Pequeño', 'Mediano', 'Grande', 'Gigante']}
    defaultOption='Mediano'
    className={styles.formInput}
  />
);

const ActivityInput = ({ onChange }) => (
  <Select
    label='Actividad diaria'
    name='activity'
    onChange={onChange}
    options={['Sedentario', 'Activo', 'Muy activo']}
    defaultOption='Activo'
    className={styles.formInput}
  />
);

const ContextureInput = ({ onChange }) => (
  <Select
    label='Contextura'
    name='contexture'
    onChange={onChange}
    options={['Bajo peso', 'Normal', 'Sobrepeso']}
    defaultOption='Normal'
    className={styles.formInput}
  />
);

const BreedInput = ({ breeds, onChange }) => (
  <FilterableSelect
    label='Raza'
    onChange={onChange}
    options={breeds}
    className={styles.formInput}
  />
);

const CastratedInput = ({ onChange, checked }) => (
  <Checkbox
    label='Castrado'
    name='castrated'
    checked={checked}
    onChange={onChange}
    className={styles.formInput}
  />
);

const Action = ({ action, disabled, text, goBack }) => (
  <div className={styles.action}>
    <PlanButton onClick={action} text={text} disabled={disabled} />
    {goBack ? (
      <PlanButton onClick={goBack} text='Volver' variant='secondary' />
    ) : null}
  </div>
);

export {
  NameInput,
  WeightInput,
  SizeInput,
  AgeInput,
  ActivityInput,
  ContextureInput,
  CastratedInput,
  BreedInput,
  Action,
};
