'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Info,
  RotateCcw,
  ShoppingBag,
} from 'lucide-react';

import Button from '../../../components/Button';
import {
  calculatePortionSizeInGrams,
  isSupportedPortionProfile,
  isValidPetWeight,
} from '../../../util/portion-size';
import {
  buildCalculatorResult,
  getCalculatorSteps,
  profileValueLabels,
  selectProfileValue,
} from '../model';
import styles from './CalculatorSteps.module.scss';

const formatGrams = (value) =>
  new Intl.NumberFormat('es-CR', { maximumFractionDigits: 0 }).format(value);

const visibleOptions = (step, profile) =>
  step.key === 'dailyActivity' && profile.bodyContexture === 'overWeight'
    ? step.options.filter(({ value }) => value !== 'veryActive')
    : step.options;

const OptionGroup = ({ onSelect, profile, step }) => (
  <fieldset className={styles.optionGroup}>
    <legend className="visually-hidden">{step.title}</legend>
    {visibleOptions(step, profile).map((option) => {
      const selected = profile[step.key] === option.value;
      return (
        <label
          className={selected ? styles.optionSelected : styles.option}
          key={option.value}
        >
          <input
            type="radio"
            name={step.key}
            value={option.value}
            checked={selected}
            onChange={() => onSelect(step.key, option.value)}
          />
          <span className={styles.optionCopy}>
            <strong>{option.label}</strong>
            {option.detail ? <small>{option.detail}</small> : null}
          </span>
          <span className={styles.optionCheck} aria-hidden="true">
            {selected ? <Check size={17} strokeWidth={3} /> : null}
          </span>
        </label>
      );
    })}
  </fieldset>
);

const ProfileSummary = ({ profile }) => {
  const steps = getCalculatorSteps(profile);
  return (
    <dl className={styles.summary}>
      {steps.map((step) => {
        const value = profile[step.key];
        return (
          <div key={step.key}>
            <dt>{step.summaryLabel}</dt>
            <dd>
              {step.key === 'weight'
                ? `${value} kg`
                : profileValueLabels[value] || value}
            </dd>
          </div>
        );
      })}
    </dl>
  );
};

const CalculatorSteps = ({ initialProfile = {}, onResult }) => {
  const [stepIndex, setStepIndex] = useState(0);
  const [profile, setProfile] = useState(initialProfile);
  const [result, setResult] = useState(null);
  const [weightError, setWeightError] = useState('');
  const headingRef = useRef(null);
  const steps = useMemo(() => getCalculatorSteps(profile), [profile]);
  const currentStep = steps[stepIndex];
  const isLastStep = stepIndex === steps.length - 1;
  const selectedValue = currentStep ? profile[currentStep.key] : null;

  useEffect(() => {
    headingRef.current?.focus();
  }, [result, stepIndex]);

  const restart = () => {
    setStepIndex(0);
    setProfile(initialProfile);
    setResult(null);
    setWeightError('');
  };

  const handleSelect = (key, value) => {
    setProfile((previous) => selectProfileValue(previous, key, value));
    setWeightError('');
  };

  const handleWeightChange = (event) => {
    const normalized = event.target.value.replace(',', '.');
    setProfile((previous) => ({ ...previous, weight: normalized }));
    setWeightError('');
  };

  const goBack = () => {
    setWeightError('');
    setStepIndex((current) => Math.max(0, current - 1));
  };

  const submitStep = (event) => {
    event.preventDefault();

    if (currentStep.type === 'weight' && !isValidPetWeight(profile.weight)) {
      setWeightError('Ingresá un peso válido entre 0,1 kg y 100 kg.');
      return;
    }

    if (!isLastStep) {
      setStepIndex((current) => current + 1);
      return;
    }

    if (!isSupportedPortionProfile(profile)) {
      setWeightError('No pudimos calcular esta combinación. Revisá los datos e intentá de nuevo.');
      return;
    }

    const portionGrams = calculatePortionSizeInGrams(profile);
    if (!portionGrams) {
      setWeightError('No pudimos calcular la porción. Revisá los datos e intentá de nuevo.');
      return;
    }

    const calculation = buildCalculatorResult(profile, portionGrams);
    setResult(calculation);
    onResult?.(calculation);
  };

  if (result) {
    return (
      <section className={styles.result} aria-live="polite" aria-labelledby="calculator-result-title">
        <div className={styles.resultHeading}>
          <p>Tu referencia diaria</p>
          <h2 id="calculator-result-title" ref={headingRef} tabIndex={-1}>
            {formatGrams(result.portionGrams)} g <span>al día</span>
          </h2>
          <p>
            Esta es una estimación inicial para Recetas completas DNAture. Ajustala
            según la evolución de tu perro y la orientación de su médico veterinario.
          </p>
        </div>

        <div className={styles.resultGrid}>
          <div>
            <h3>Datos utilizados</h3>
            <ProfileSummary profile={profile} />
          </div>
          <aside className={styles.resultNote}>
            <Info aria-hidden="true" size={21} />
            <div>
              <strong>Es un punto de partida</strong>
              <p>
                Observá peso, condición corporal y apetito. Si existe una condición
                médica, consultá antes de cambiar su alimentación.
              </p>
            </div>
          </aside>
        </div>

        <div className={styles.resultActions}>
          <Button
            variant="primary"
            href="/productos?category=recetas"
            iconEnd={<ShoppingBag aria-hidden="true" size={18} />}
          >
            Ver Recetas completas
          </Button>
          <Button
            variant="secondary"
            onClick={restart}
            iconStart={<RotateCcw aria-hidden="true" size={17} />}
          >
            Calcular otra porción
          </Button>
        </div>
      </section>
    );
  }

  return (
    <form className={styles.calculatorSteps} onSubmit={submitStep} noValidate>
      <div className={styles.progressHeader}>
        <div>
          <span>Paso {stepIndex + 1} de {steps.length}</span>
          <strong>
            {profile.age === 'puppy'
              ? 'Cachorro'
              : profile.age === 'adult'
                ? 'Perro adulto'
                : 'Para perros'}
          </strong>
        </div>
        <div
          className={styles.progressTrack}
          role="progressbar"
          aria-label="Progreso de la calculadora"
          aria-valuemin="1"
          aria-valuemax={steps.length}
          aria-valuenow={stepIndex + 1}
        >
          <span style={{ width: `${((stepIndex + 1) / steps.length) * 100}%` }} />
        </div>
      </div>

      <div className={styles.step}>
        <h2 ref={headingRef} tabIndex={-1}>{currentStep.title}</h2>
        <p className={styles.stepDescription}>{currentStep.description}</p>

        {currentStep.type === 'weight' ? (
          <div className={styles.weightField}>
            <label htmlFor="calculator-weight">Peso actual</label>
            <div>
              <input
                id="calculator-weight"
                required
                type="text"
                inputMode="decimal"
                autoComplete="off"
                aria-describedby={`calculator-weight-help${weightError ? ' calculator-weight-error' : ''}`}
                aria-invalid={Boolean(weightError)}
                value={profile.weight || ''}
                onChange={handleWeightChange}
                placeholder="Ej. 8,5"
              />
              <span>kg</span>
            </div>
            <p id="calculator-weight-help">Acepta valores entre 0,1 kg y 100 kg.</p>
          </div>
        ) : (
          <OptionGroup step={currentStep} profile={profile} onSelect={handleSelect} />
        )}

        {weightError ? (
          <p className={styles.warning} id="calculator-weight-error" role="alert">
            {weightError}
          </p>
        ) : null}
      </div>

      <div className={styles.calculatorControls}>
        {stepIndex > 0 ? (
          <Button
            variant="tertiary"
            type="button"
            onClick={goBack}
            iconStart={<ArrowLeft aria-hidden="true" size={18} />}
          >
            Anterior
          </Button>
        ) : <span />}
        <Button
          variant="primary"
          type="submit"
          disabled={!selectedValue}
          iconEnd={<ArrowRight aria-hidden="true" size={18} />}
        >
          {isLastStep ? 'Ver mi porción' : 'Siguiente'}
        </Button>
      </div>
    </form>
  );
};

export default CalculatorSteps;
