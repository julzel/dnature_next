const profileValueLabels = {
  adult: 'Adulto',
  puppy: 'Cachorro',
  stage1: 'Menor de 7 meses',
  stage2: 'De 7 a 12 meses',
  stage3: 'Mayor de 1 año, aún en crecimiento',
  small: 'Mini',
  medium: 'Pequeño o mediano',
  large: 'Grande o gigante',
  castrated: 'Esterilizado/a',
  notCastrated: 'Sin esterilizar',
  underWeight: 'Bajo peso',
  ideal: 'Condición ideal',
  overWeight: 'Sobrepeso',
  sedentary: 'Actividad tranquila',
  active: 'Actividad regular',
  veryActive: 'Actividad alta',
};

const adultSteps = [
  {
    key: 'age',
    summaryLabel: 'Etapa de vida',
    title: '¿En qué etapa de vida está?',
    description: 'Esto nos ayuda a usar una referencia apropiada para crecimiento o adultez.',
    options: [
      { value: 'adult', label: 'Adulto', detail: 'Ya alcanzó su etapa adulta' },
      { value: 'puppy', label: 'Cachorro', detail: 'Todavía está en crecimiento' },
    ],
  },
  {
    key: 'size',
    summaryLabel: 'Tamaño',
    title: '¿Cuál es su tamaño?',
    description: 'Elegí la categoría que mejor describe su tamaño corporal adulto.',
    options: [
      { value: 'small', label: 'Mini', detail: 'Hasta 4 kg aproximadamente' },
      { value: 'medium', label: 'Pequeño o mediano', detail: 'Más de 4 kg y hasta 25 kg' },
      { value: 'large', label: 'Grande o gigante', detail: 'Más de 25 kg' },
    ],
  },
  {
    key: 'castrated',
    summaryLabel: 'Esterilización',
    title: '¿Está esterilizado?',
    description: 'La esterilización puede cambiar sus necesidades energéticas.',
    options: [
      { value: 'castrated', label: 'Sí, está esterilizado/a' },
      { value: 'notCastrated', label: 'No está esterilizado/a' },
    ],
  },
  {
    key: 'bodyContexture',
    summaryLabel: 'Condición corporal',
    title: '¿Cómo describirías su condición corporal?',
    description: 'Elegí la opción más cercana. Si no estás seguro, un médico veterinario puede ayudarte a evaluarla.',
    options: [
      { value: 'underWeight', label: 'Bajo peso', detail: 'Necesita recuperar condición corporal' },
      { value: 'ideal', label: 'Condición ideal', detail: 'Mantiene una contextura saludable para su cuerpo' },
      { value: 'overWeight', label: 'Sobrepeso', detail: 'Necesita controlar su condición corporal' },
    ],
  },
  {
    key: 'dailyActivity',
    summaryLabel: 'Actividad diaria',
    title: '¿Cómo es su actividad diaria?',
    description: 'Pensá en una semana habitual, no en un día excepcional.',
    options: [
      { value: 'sedentary', label: 'Tranquila', detail: 'Paseos cortos y mucho descanso' },
      { value: 'active', label: 'Regular', detail: 'Paseos o juego todos los días' },
      { value: 'veryActive', label: 'Alta', detail: 'Ejercicio intenso o actividad deportiva' },
    ],
  },
  {
    key: 'weight',
    summaryLabel: 'Peso actual',
    title: '¿Cuál es su peso actual?',
    description: 'Ingresalo en kilogramos. Podés usar decimales, por ejemplo 8,5 kg.',
    type: 'weight',
  },
];

const puppySteps = [
  adultSteps[0],
  {
    key: 'puppyStage',
    summaryLabel: 'Etapa de crecimiento',
    title: '¿En qué etapa de crecimiento está?',
    description: 'La referencia cambia rápidamente durante el crecimiento.',
    options: [
      { value: 'stage1', label: 'Etapa 1', detail: 'Menor de 7 meses' },
      { value: 'stage2', label: 'Etapa 2', detail: 'De 7 a 12 meses' },
      { value: 'stage3', label: 'Etapa 3', detail: 'Mayor de 1 año, aún en crecimiento' },
    ],
  },
  adultSteps.at(-1),
];

const getCalculatorSteps = (profile = {}) =>
  profile.age === 'puppy' ? puppySteps : adultSteps;

const selectProfileValue = (profile, key, value) => {
  if (key === 'age' && profile.age !== value) {
    return { age: value };
  }

  const nextProfile = { ...profile, [key]: value };
  if (
    key === 'bodyContexture' &&
    value === 'overWeight' &&
    nextProfile.dailyActivity === 'veryActive'
  ) {
    delete nextProfile.dailyActivity;
  }
  return nextProfile;
};

const buildCalculatorResult = (profile, portionGrams) => ({
  portionGrams,
  petDraft: {
    species: 'dog',
    lifeStage: profile.age,
    puppyStage: profile.puppyStage || null,
    size: profile.size || null,
    sterilization: profile.castrated || null,
    bodyCondition: profile.bodyContexture || null,
    activity: profile.dailyActivity || null,
    weightKg: Number(profile.weight),
  },
});

export {
  buildCalculatorResult,
  getCalculatorSteps,
  profileValueLabels,
  selectProfileValue,
};
