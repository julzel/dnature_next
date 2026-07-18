const MIN_PET_WEIGHT_KG = 0.1;
const MAX_PET_WEIGHT_KG = 100;

const dogPortionPercentages = {
  adult: {
    small: {
      castrated: {
        underWeight: { sedentary: 3.5, active: 4, veryActive: 4.5 },
        ideal: { sedentary: 3, active: 3.5, veryActive: 4 },
        overWeight: { sedentary: 2.5, active: 3 },
      },
      notCastrated: {
        underWeight: { sedentary: 4, active: 4.5, veryActive: 5 },
        ideal: { sedentary: 3.5, active: 4, veryActive: 4.5 },
        overWeight: { sedentary: 2.5, active: 3 },
      },
    },
    medium: {
      castrated: {
        underWeight: { sedentary: 3, active: 3.5, veryActive: 4 },
        ideal: { sedentary: 2.5, active: 3, veryActive: 3.5 },
        overWeight: { sedentary: 2, active: 2.5 },
      },
      notCastrated: {
        underWeight: { sedentary: 3.5, active: 4, veryActive: 4.5 },
        ideal: { sedentary: 3, active: 3.5, veryActive: 4 },
        overWeight: { sedentary: 2.5, active: 3 },
      },
    },
    large: {
      castrated: {
        underWeight: { sedentary: 2.5, active: 3, veryActive: 3.5 },
        ideal: { sedentary: 2, active: 2.5, veryActive: 3 },
        overWeight: { sedentary: 1.5, active: 2 },
      },
      notCastrated: {
        underWeight: { sedentary: 3, active: 3.5, veryActive: 4 },
        ideal: { sedentary: 2.5, active: 3, veryActive: 3.5 },
        overWeight: { sedentary: 2, active: 2.5 },
      },
    },
  },
  puppy: {
    stage1: 10,
    stage2: 7,
    stage3: 4,
  },
};

const legacyValues = {
  adulto: 'adult',
  cachorro: 'puppy',
  pequeno: 'small',
  mediano: 'medium',
  grande: 'large',
  castrado: 'castrated',
  noCastrado: 'notCastrated',
  bajoPeso: 'underWeight',
  pesoIdeal: 'ideal',
  sobrepeso: 'overWeight',
  sedentario: 'sedentary',
  activo: 'active',
  deportista: 'veryActive',
};

const normalizeValue = (value) => legacyValues[value] || value;

const normalizeProfile = (profile = {}) => ({
  age: normalizeValue(profile.age),
  puppyStage: normalizeValue(profile.puppyStage || profile.stage),
  size: normalizeValue(profile.size),
  castrated: normalizeValue(profile.castrated),
  bodyContexture: normalizeValue(profile.bodyContexture || profile.weightStatus),
  dailyActivity: normalizeValue(profile.dailyActivity || profile.activity),
  weight: Number(profile.weight),
});

const isValidPetWeight = (value) => {
  const weight = Number(value);

  return (
    Number.isFinite(weight) &&
    weight >= MIN_PET_WEIGHT_KG &&
    weight <= MAX_PET_WEIGHT_KG
  );
};

const isSupportedPortionProfile = (profile) => {
  const normalized = normalizeProfile(profile);

  if (!isValidPetWeight(normalized.weight)) {
    return false;
  }

  if (normalized.age === 'puppy') {
    return Boolean(dogPortionPercentages.puppy[normalized.puppyStage]);
  }

  return Boolean(
    dogPortionPercentages.adult?.[normalized.size]?.[normalized.castrated]?.[
      normalized.bodyContexture
    ]?.[normalized.dailyActivity]
  );
};

const calculatePortionSizeInGrams = (profile) => {
  const normalized = normalizeProfile(profile);

  if (!isSupportedPortionProfile(normalized)) {
    return null;
  }

  const percentage =
    normalized.age === 'puppy'
      ? dogPortionPercentages.puppy[normalized.puppyStage]
      : dogPortionPercentages.adult[normalized.size][normalized.castrated][
          normalized.bodyContexture
        ][normalized.dailyActivity];
  const portionSize = percentage * normalized.weight * 10;

  return Number.isFinite(portionSize) && portionSize > 0 ? portionSize : null;
};

const labelKeys = {
  age: 'Edad',
  size: 'Tamaño',
  castrated: 'Castración',
  weightStatus: 'Contextura',
  activity: 'Actividad física',
  stage: 'Etapa del cachorro',
  weight: 'Peso en kilogramos',
};

const valueKeys = {
  adulto: 'Adulto',
  cachorro: 'Cachorro',
  castrado: 'Castrado',
  noCastrado: 'Sin castrar',
  pequeno: 'Mini',
  mediano: 'Pequeño - Mediano',
  grande: 'Grande - Gigante',
  bajoPeso: 'Bajo peso',
  pesoIdeal: 'Ideal',
  sobrepeso: 'Sobrepeso',
  sedentario: 'Sedentario',
  activo: 'Activo',
  deportista: 'Deportista',
  stage1: 'Etapa 1',
  stage2: 'Etapa 2',
  stage3: 'Etapa 3',
};

export {
  MAX_PET_WEIGHT_KG,
  MIN_PET_WEIGHT_KG,
  calculatePortionSizeInGrams,
  isSupportedPortionProfile,
  isValidPetWeight,
  labelKeys,
  valueKeys,
};
