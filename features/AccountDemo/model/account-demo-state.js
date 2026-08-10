import { calculatePortionSizeInGrams } from '../../../util/portion-size';

const ACCOUNT_DEMO_STORAGE_KEY = 'dnature-account-demo-v1';
const ACCOUNT_DEMO_STORAGE_VERSION = 2;
const LEGACY_ACCOUNT_DEMO_STORAGE_VERSIONS = [1];
const MAX_DEMO_PETS = 10;
const MAX_DEMO_SAVED_CARTS = 5;

const defaultProfile = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  province: '',
  canton: '',
  district: '',
  address: '',
};

const defaultPreferences = {
  personalization: true,
  inAccountReminders: true,
};

const createInitialAccountDemoState = () => ({
  version: ACCOUNT_DEMO_STORAGE_VERSION,
  isAuthenticated: false,
  provider: null,
  profile: { ...defaultProfile },
  pets: [],
  selectedPetId: null,
  savedCarts: [],
  favoritePartnerIds: [],
  preferences: { ...defaultPreferences },
});

const createSamplePet = (pet) => ({
  ...pet,
  portionSize: calculatePortionSizeInGrams(pet),
});

const samplePets = [
  createSamplePet({
    id: 'demo-pet-luna',
    name: 'Luna',
    age: 'adult',
    puppyStage: 'stage1',
    size: 'medium',
    castrated: 'castrated',
    bodyContexture: 'ideal',
    dailyActivity: 'active',
    weight: 18,
  }),
  createSamplePet({
    id: 'demo-pet-nala',
    name: 'Nala',
    age: 'adult',
    puppyStage: 'stage1',
    size: 'small',
    castrated: 'castrated',
    bodyContexture: 'ideal',
    dailyActivity: 'sedentary',
    weight: 4.5,
  }),
];

const sampleSavedCarts = [
  {
    id: 'demo-cart-quincena',
    label: 'Alimento de la quincena',
    savedAt: '2026-08-07T15:30:00.000Z',
    items: [
      {
        id: 'demo-receta-pollo-1kg',
        productName: 'Receta completa de pollo',
        presentation: '1 kg',
        quantity: 4,
        price: 5650,
      },
      {
        id: 'demo-snack-natural',
        productName: 'Snack natural',
        presentation: '100 g',
        quantity: 1,
        price: 3200,
      },
    ],
  },
  {
    id: 'demo-cart-favoritos',
    label: 'Favoritos de Luna',
    savedAt: '2026-07-29T18:10:00.000Z',
    items: [
      {
        id: 'demo-receta-res-1kg',
        productName: 'Receta completa de res',
        presentation: '1 kg',
        quantity: 2,
        price: 6100,
      },
    ],
  },
];

const createSampleAccountDemoState = () => ({
  version: ACCOUNT_DEMO_STORAGE_VERSION,
  isAuthenticated: true,
  provider: 'demo',
  profile: {
    firstName: 'Sofía',
    lastName: 'Ramírez',
    email: 'sofia.demo@dnaturefood.com',
    phone: '8888-1234',
    province: 'San José',
    canton: 'Montes de Oca',
    district: 'San Pedro',
    address: 'Del parque, 200 m este. Casa color verde.',
  },
  pets: samplePets,
  selectedPetId: samplePets[0].id,
  savedCarts: sampleSavedCarts,
  favoritePartnerIds: ['demo-clinica-arboleda', 'demo-petshop-colitas'],
  preferences: { ...defaultPreferences },
});

const normalizeString = (value, fallback = '') =>
  typeof value === 'string' ? value.slice(0, 180) : fallback;

const normalizeProfile = (profile = {}) => ({
  firstName: normalizeString(profile.firstName),
  lastName: normalizeString(profile.lastName),
  email: normalizeString(profile.email),
  phone: normalizeString(profile.phone),
  province: normalizeString(profile.province),
  canton: normalizeString(profile.canton),
  district: normalizeString(profile.district),
  address: normalizeString(profile.address, '').slice(0, 300),
});

const normalizePet = (pet) => {
  const weight = Number(pet?.weight);
  const normalized = {
    id: normalizeString(pet?.id),
    name: normalizeString(pet?.name).slice(0, 40),
    age: pet?.age === 'puppy' ? 'puppy' : 'adult',
    puppyStage: ['stage1', 'stage2', 'stage3'].includes(pet?.puppyStage)
      ? pet.puppyStage
      : 'stage1',
    size: ['small', 'medium', 'large'].includes(pet?.size)
      ? pet.size
      : 'medium',
    castrated: pet?.castrated === 'notCastrated' ? 'notCastrated' : 'castrated',
    bodyContexture: ['underWeight', 'ideal', 'overWeight'].includes(
      pet?.bodyContexture
    )
      ? pet.bodyContexture
      : 'ideal',
    dailyActivity: ['sedentary', 'active', 'veryActive'].includes(
      pet?.dailyActivity
    )
      ? pet.dailyActivity
      : 'active',
    weight: Number.isFinite(weight) ? weight : '',
  };

  return {
    ...normalized,
    portionSize: calculatePortionSizeInGrams(normalized),
  };
};

const normalizeCartItem = (item) => {
  const quantity = Number(item?.quantity);
  const price = Number(item?.price);

  if (!item?.id || !Number.isFinite(quantity) || quantity <= 0) {
    return null;
  }

  return {
    id: normalizeString(item.id),
    productName: normalizeString(item.productName, 'Producto DNAture'),
    presentation: normalizeString(item.presentation),
    quantity: Math.min(Math.round(quantity), 99),
    price: Number.isFinite(price) && price >= 0 ? price : 0,
    ...(typeof item.image === 'string' ? { image: item.image } : {}),
  };
};

const normalizeSavedCart = (cart) => ({
  id: normalizeString(cart?.id),
  label: normalizeString(cart?.label, 'Carrito guardado').slice(0, 60),
  savedAt: Number.isFinite(Date.parse(cart?.savedAt))
    ? cart.savedAt
    : new Date().toISOString(),
  items: (Array.isArray(cart?.items) ? cart.items : [])
    .map(normalizeCartItem)
    .filter(Boolean)
    .slice(0, 50),
});

const normalizeAccountDemoState = (state) => {
  if (
    !state ||
    ![
      ACCOUNT_DEMO_STORAGE_VERSION,
      ...LEGACY_ACCOUNT_DEMO_STORAGE_VERSIONS,
    ].includes(state.version)
  ) {
    return createInitialAccountDemoState();
  }

  const pets = (Array.isArray(state.pets) ? state.pets : [])
    .map(normalizePet)
    .filter((pet) => pet.id && pet.name && pet.portionSize)
    .slice(0, MAX_DEMO_PETS);
  const selectedPetId = pets.some((pet) => pet.id === state.selectedPetId)
    ? state.selectedPetId
    : pets[0]?.id || null;

  return {
    version: ACCOUNT_DEMO_STORAGE_VERSION,
    isAuthenticated: Boolean(state.isAuthenticated),
    provider: normalizeString(state.provider) || null,
    profile: normalizeProfile(state.profile),
    pets,
    selectedPetId,
    savedCarts: (Array.isArray(state.savedCarts) ? state.savedCarts : [])
      .map(normalizeSavedCart)
      .filter((cart) => cart.id && cart.items.length > 0)
      .slice(0, MAX_DEMO_SAVED_CARTS),
    favoritePartnerIds: [
      ...new Set(
        (Array.isArray(state.favoritePartnerIds)
          ? state.favoritePartnerIds
          : []
        )
          .map((partnerId) => normalizeString(partnerId).slice(0, 100))
          .filter(Boolean)
      ),
    ].slice(0, 50),
    preferences: {
      personalization: state.preferences?.personalization !== false,
      inAccountReminders: state.preferences?.inAccountReminders !== false,
    },
  };
};

const accountDemoReducer = (state, action) => {
  switch (action.type) {
    case 'HYDRATE':
      return normalizeAccountDemoState(action.state);
    case 'SIGN_IN':
      return {
        ...state,
        isAuthenticated: true,
        provider: action.provider,
        profile: normalizeProfile({ ...state.profile, ...action.profile }),
      };
    case 'LOAD_SAMPLE':
      return createSampleAccountDemoState();
    case 'SIGN_OUT':
      return { ...state, isAuthenticated: false, provider: null };
    case 'UPDATE_PROFILE':
      return { ...state, profile: normalizeProfile(action.profile) };
    case 'UPDATE_PREFERENCES':
      return {
        ...state,
        preferences: {
          ...state.preferences,
          ...action.preferences,
        },
      };
    case 'UPSERT_PET': {
      const pet = normalizePet(action.pet);

      if (!pet.id || !pet.name || !pet.portionSize) return state;

      const exists = state.pets.some((currentPet) => currentPet.id === pet.id);
      if (!exists && state.pets.length >= MAX_DEMO_PETS) return state;

      const pets = exists
        ? state.pets.map((currentPet) =>
            currentPet.id === pet.id ? pet : currentPet
          )
        : [...state.pets, pet];

      return {
        ...state,
        pets,
        selectedPetId: state.selectedPetId || pet.id,
      };
    }
    case 'DELETE_PET': {
      const pets = state.pets.filter((pet) => pet.id !== action.petId);
      return {
        ...state,
        pets,
        selectedPetId:
          state.selectedPetId === action.petId
            ? pets[0]?.id || null
            : state.selectedPetId,
      };
    }
    case 'SELECT_PET':
      return state.pets.some((pet) => pet.id === action.petId)
        ? { ...state, selectedPetId: action.petId }
        : state;
    case 'SAVE_CART': {
      const cart = normalizeSavedCart(action.cart);
      if (!cart.id || cart.items.length === 0) return state;

      return {
        ...state,
        savedCarts: [
          cart,
          ...state.savedCarts.filter((savedCart) => savedCart.id !== cart.id),
        ].slice(0, MAX_DEMO_SAVED_CARTS),
      };
    }
    case 'DELETE_SAVED_CART':
      return {
        ...state,
        savedCarts: state.savedCarts.filter((cart) => cart.id !== action.cartId),
      };
    case 'TOGGLE_FAVORITE_PARTNER': {
      const partnerId = normalizeString(action.partnerId).slice(0, 100);
      if (!partnerId) return state;

      return {
        ...state,
        favoritePartnerIds: state.favoritePartnerIds.includes(partnerId)
          ? state.favoritePartnerIds.filter((id) => id !== partnerId)
          : [...state.favoritePartnerIds, partnerId].slice(-50),
      };
    }
    case 'RESET':
      return createInitialAccountDemoState();
    default:
      return state;
  }
};

const savedCartTotal = (cart) =>
  cart.items.reduce((total, item) => total + item.price * item.quantity, 0);

export {
  ACCOUNT_DEMO_STORAGE_KEY,
  ACCOUNT_DEMO_STORAGE_VERSION,
  MAX_DEMO_PETS,
  MAX_DEMO_SAVED_CARTS,
  accountDemoReducer,
  createInitialAccountDemoState,
  createSampleAccountDemoState,
  normalizeAccountDemoState,
  normalizePet,
  savedCartTotal,
};
