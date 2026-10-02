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

const formatGrams = (value) =>
  new Intl.NumberFormat('es-CR', { maximumFractionDigits: 0 }).format(value);

const visibleOptions = (step, profile) =>
  step.key === 'dailyActivity' && profile.bodyContexture === 'overWeight'
    ? step.options.filter(({ value }) => value !== 'veryActive')
    : step.options;

const OptionGroup = ({ onSelect, profile, step }) => (
  <fieldset>
    <legend>{step.title}</legend>
    {visibleOptions(step, profile).map((option) => {
      const selected = profile[step.key] === option.value;
      return (
        <label
          key={option.value}
        >
          <input
            type="radio"
            name={step.key}
            value={option.value}
            checked={selected}
            onChange={() => onSelect(step.key, option.value)}
          />
          <span>
            <strong>{option.label}</strong>
            {option.detail ? <small>{option.detail}</small> : null}
          </span>
          <span aria-hidden="true">
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
    <dl>
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
      <section aria-live="polite" aria-labelledby="calculator-result-title">
        <div>
          <p>Tu referencia diaria</p>
          <h2 id="calculator-result-title" ref={headingRef} tabIndex={-1}>
            {formatGrams(result.portionGrams)} g <span>al día</span>
          </h2>
          <p>
            Esta es una estimación inicial para Recetas completas DNAture. Ajustala
            según la evolución de tu perro y la orientación de su médico veterinario.
          </p>
        </div>

        <div>
          <div>
            <h3>Datos utilizados</h3>
            <ProfileSummary profile={profile} />
          </div>
          <aside>
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

        <div>
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
    <form onSubmit={submitStep} noValidate>
      <div>
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
        <progress
          aria-label="Progreso de la calculadora"
          max={steps.length}
          value={stepIndex + 1}
        >
          Paso {stepIndex + 1} de {steps.length}
        </progress>
      </div>

      <div>
        <h2 ref={headingRef} tabIndex={-1}>{currentStep.title}</h2>
        <p>{currentStep.description}</p>

        {currentStep.type === 'weight' ? (
          <div>
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
          <p id="calculator-weight-error" role="alert">
            {weightError}
          </p>
        ) : null}
      </div>

      <div>
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
