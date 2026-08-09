'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from 'react';

import {
  ACCOUNT_DEMO_STORAGE_KEY,
  accountDemoReducer,
  createInitialAccountDemoState,
} from './account-demo-state';

const AccountDemoContext = createContext(null);

const createId = (prefix) => {
  const uuid = globalThis.crypto?.randomUUID?.();
  return `${prefix}-${uuid || `${Date.now()}-${Math.random().toString(16).slice(2)}`}`;
};

const AccountDemoProvider = ({ children }) => {
  const [state, dispatch] = useReducer(
    accountDemoReducer,
    undefined,
    createInitialAccountDemoState
  );
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    try {
      const storedValue = window.localStorage.getItem(ACCOUNT_DEMO_STORAGE_KEY);
      if (storedValue) {
        dispatch({ type: 'HYDRATE', state: JSON.parse(storedValue) });
      }
    } catch (error) {
      console.warn('No se pudo cargar la cuenta de demostración.', error);
    } finally {
      setIsReady(true);
    }
  }, []);

  useEffect(() => {
    if (!isReady) return;

    try {
      window.localStorage.setItem(ACCOUNT_DEMO_STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.warn('No se pudo guardar la cuenta de demostración.', error);
    }
  }, [isReady, state]);

  const signIn = useCallback(({ provider, email, firstName = 'Cliente' }) => {
    dispatch({
      type: 'SIGN_IN',
      provider,
      profile: {
        firstName,
        email,
      },
    });
  }, []);

  const loadSampleAccount = useCallback(() => {
    dispatch({ type: 'LOAD_SAMPLE' });
  }, []);

  const signOut = useCallback(() => {
    dispatch({ type: 'SIGN_OUT' });
  }, []);

  const updateProfile = useCallback((profile) => {
    dispatch({ type: 'UPDATE_PROFILE', profile });
  }, []);

  const updatePreferences = useCallback((preferences) => {
    dispatch({ type: 'UPDATE_PREFERENCES', preferences });
  }, []);

  const savePet = useCallback((pet) => {
    dispatch({
      type: 'UPSERT_PET',
      pet: {
        ...pet,
        id: pet.id || createId('demo-pet'),
      },
    });
  }, []);

  const deletePet = useCallback((petId) => {
    dispatch({ type: 'DELETE_PET', petId });
  }, []);

  const selectPet = useCallback((petId) => {
    dispatch({ type: 'SELECT_PET', petId });
  }, []);

  const saveCart = useCallback((cart, label) => {
    dispatch({
      type: 'SAVE_CART',
      cart: {
        id: createId('demo-cart'),
        label: label || 'Carrito guardado',
        savedAt: new Date().toISOString(),
        items: cart.items,
      },
    });
  }, []);

  const deleteSavedCart = useCallback((cartId) => {
    dispatch({ type: 'DELETE_SAVED_CART', cartId });
  }, []);

  const toggleFavoritePartner = useCallback((partnerId) => {
    dispatch({ type: 'TOGGLE_FAVORITE_PARTNER', partnerId });
  }, []);

  const resetDemo = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  const selectedPet = useMemo(
    () => state.pets.find((pet) => pet.id === state.selectedPetId) || null,
    [state.pets, state.selectedPetId]
  );

  const value = useMemo(
    () => ({
      ...state,
      isReady,
      selectedPet,
      signIn,
      signOut,
      loadSampleAccount,
      updateProfile,
      updatePreferences,
      savePet,
      deletePet,
      selectPet,
      saveCart,
      deleteSavedCart,
      toggleFavoritePartner,
      resetDemo,
    }),
    [
      deletePet,
      deleteSavedCart,
      isReady,
      loadSampleAccount,
      resetDemo,
      saveCart,
      savePet,
      selectPet,
      selectedPet,
      signIn,
      signOut,
      state,
      toggleFavoritePartner,
      updatePreferences,
      updateProfile,
    ]
  );

  return (
    <AccountDemoContext.Provider value={value}>
      {children}
    </AccountDemoContext.Provider>
  );
};

const useAccountDemo = () => {
  const context = useContext(AccountDemoContext);
  if (!context) {
    throw new Error('useAccountDemo debe usarse dentro de AccountDemoProvider.');
  }
  return context;
};

export { AccountDemoProvider, useAccountDemo };
