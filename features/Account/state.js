'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { useRouter } from 'next/navigation';

import { createClient } from '../../services/supabase/client';
import {
  confirmAgeAction,
  deletePetAction,
  deleteSavedCartAction,
  saveAddressAction,
  saveCartAction,
  savePetAction,
  restoreSavedCartAction,
  updateProfileAction,
} from './actions';
import {
  COSTA_RICA_PROVINCES,
  MAX_PETS,
  MAX_SAVED_CARTS,
} from './model/account-validation';

const AccountContext = createContext(null);

const runAccountAction = async (action, ...args) => {
  try {
    return await action(...args);
  } catch (error) {
    console.error('Customer account action failed unexpectedly.', {
      name: error?.name,
    });
    return {
      ok: false,
      message: 'No pudimos completar la acción. Revisá tu conexión e intentá nuevamente.',
      code: 'ACTION_UNAVAILABLE',
    };
  }
};

const AccountProvider = ({ account, children }) => {
  const router = useRouter();
  const [state, setState] = useState(account);

  const updateProfile = useCallback(async (profile) => {
    const result = await runAccountAction(updateProfileAction, profile);
    if (result.ok) {
      setState((current) => ({
        ...current,
        profile: { ...current.profile, ...result.profile },
      }));
    }
    return result;
  }, []);

  const saveAddress = useCallback(async (address) => {
    const result = await runAccountAction(saveAddressAction, address);
    if (result.ok) {
      setState((current) => ({
        ...current,
        addresses: [
          result.address,
          ...current.addresses.filter((item) => item.id !== result.address.id),
        ],
        profile: { ...current.profile, ...result.address },
      }));
    }
    return result;
  }, []);

  const confirmAge = useCallback(async () => {
    const result = await runAccountAction(confirmAgeAction);
    if (result.ok) {
      setState((current) => ({
        ...current,
        profile: { ...current.profile, ageConfirmed: true },
      }));
    }
    return result;
  }, []);

  const savePet = useCallback(async (pet) => {
    const result = await runAccountAction(savePetAction, pet);
    if (result.ok) {
      setState((current) => {
        const exists = current.pets.some((item) => item.id === result.pet.id);
        const pets = exists
          ? current.pets.map((item) =>
              item.id === result.pet.id ? result.pet : item
            )
          : [...current.pets, result.pet];
        return {
          ...current,
          pets,
          selectedPetId: current.selectedPetId || result.pet.id,
        };
      });
    }
    return result;
  }, []);

  const deletePet = useCallback(async (petId) => {
    const result = await runAccountAction(deletePetAction, petId);
    if (result.ok) {
      setState((current) => {
        const remainingPets = current.pets.filter((pet) => pet.id !== petId);
        return {
          ...current,
          pets: remainingPets,
          selectedPetId:
            current.selectedPetId === petId
              ? remainingPets[0]?.id || null
              : current.selectedPetId,
        };
      });
    }
    return result;
  }, []);

  const choosePet = useCallback((petId) => {
    setState((current) =>
      current.pets.some((pet) => pet.id === petId)
        ? { ...current, selectedPetId: petId }
        : current
    );
  }, []);

  const saveCart = useCallback(async (cart, label) => {
    const result = await runAccountAction(saveCartAction, cart, label);
    if (result.ok) {
      setState((current) => ({
        ...current,
        savedCarts: [
          result.cart,
          ...current.savedCarts.filter((item) => item.id !== result.cart.id),
        ].slice(0, MAX_SAVED_CARTS),
      }));
    }
    return result;
  }, []);

  const deleteSavedCart = useCallback(async (cartId) => {
    const result = await runAccountAction(deleteSavedCartAction, cartId);
    if (result.ok) {
      setState((current) => ({
        ...current,
        savedCarts: current.savedCarts.filter((cart) => cart.id !== cartId),
      }));
    }
    return result;
  }, []);

  const restoreSavedCart = useCallback(
    async (cartId) => runAccountAction(restoreSavedCartAction, cartId),
    []
  );

  const signOut = useCallback(async () => {
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signOut({ scope: 'local' });

      if (error) {
        return {
          ok: false,
          message: 'No pudimos cerrar la sesión. Intentá nuevamente.',
        };
      }

      router.replace('/cuenta/iniciar-sesion');
      router.refresh();
      return { ok: true };
    } catch {
      return {
        ok: false,
        message: 'No pudimos cerrar la sesión. Revisá tu conexión e intentá nuevamente.',
      };
    }
  }, [router]);

  const selectedPet = useMemo(
    () => state.pets.find((pet) => pet.id === state.selectedPetId) || null,
    [state.pets, state.selectedPetId]
  );

  const value = useMemo(
    () => ({
      ...state,
      isAuthenticated: true,
      isReady: true,
      selectedPet,
      confirmAge,
      deletePet,
      deleteSavedCart,
      saveAddress,
      saveCart,
      savePet,
      restoreSavedCart,
      choosePet,
      signOut,
      updateProfile,
      maxPets: MAX_PETS,
      maxSavedCarts: MAX_SAVED_CARTS,
    }),
    [
      confirmAge,
      deletePet,
      deleteSavedCart,
      saveAddress,
      saveCart,
      savePet,
      restoreSavedCart,
      choosePet,
      selectedPet,
      signOut,
      state,
      updateProfile,
    ]
  );

  return <AccountContext.Provider value={value}>{children}</AccountContext.Provider>;
};

const useAccount = () => {
  const value = useContext(AccountContext);
  if (!value) {
    throw new Error('useAccount debe usarse dentro de AccountProvider.');
  }
  return value;
};

export { AccountProvider, COSTA_RICA_PROVINCES, useAccount };
