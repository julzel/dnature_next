import { describe, expect, it } from 'vitest';

import {
  MAX_DEMO_SAVED_CARTS,
  accountDemoReducer,
  createInitialAccountDemoState,
  createSampleAccountDemoState,
  normalizeAccountDemoState,
  savedCartTotal,
} from '../../features/AccountDemo/model/account-demo-state';

describe('account demo state', () => {
  it('loads a complete stakeholder sample with valid pet portions', () => {
    const state = createSampleAccountDemoState();

    expect(state.isAuthenticated).toBe(true);
    expect(state.profile.firstName).toBe('Sofía');
    expect(state.pets).toHaveLength(2);
    expect(state.pets.every((pet) => pet.portionSize > 0)).toBe(true);
    expect(state.selectedPetId).toBe(state.pets[0].id);
    expect(savedCartTotal(state.savedCarts[0])).toBe(25800);
  });

  it('signs in without erasing profile fields that were already saved', () => {
    const state = {
      ...createInitialAccountDemoState(),
      profile: {
        ...createInitialAccountDemoState().profile,
        firstName: 'Ana',
        phone: '8888-8888',
      },
    };

    const signedIn = accountDemoReducer(state, {
      type: 'SIGN_IN',
      provider: 'google',
      profile: { email: 'ana@example.com' },
    });

    expect(signedIn.profile).toMatchObject({
      firstName: 'Ana',
      phone: '8888-8888',
      email: 'ana@example.com',
    });
  });

  it('adds, updates, selects, and removes pet profiles immutably', () => {
    const initial = createInitialAccountDemoState();
    const pet = {
      id: 'pet-sol',
      name: 'Sol',
      age: 'adult',
      size: 'medium',
      castrated: 'castrated',
      bodyContexture: 'ideal',
      dailyActivity: 'active',
      weight: 10,
    };
    const added = accountDemoReducer(initial, { type: 'UPSERT_PET', pet });
    const updated = accountDemoReducer(added, {
      type: 'UPSERT_PET',
      pet: { ...pet, weight: 12 },
    });
    const removed = accountDemoReducer(updated, {
      type: 'DELETE_PET',
      petId: pet.id,
    });

    expect(initial.pets).toEqual([]);
    expect(added.selectedPetId).toBe(pet.id);
    expect(updated.pets[0]).toMatchObject({ weight: 12, portionSize: 360 });
    expect(removed).toMatchObject({ pets: [], selectedPetId: null });
  });

  it('keeps only the latest allowed saved carts', () => {
    const item = {
      id: 'item-1',
      productName: 'Receta',
      presentation: '1 kg',
      quantity: 1,
      price: 5000,
    };
    const state = Array.from({ length: MAX_DEMO_SAVED_CARTS + 2 }).reduce(
      (current, _, index) =>
        accountDemoReducer(current, {
          type: 'SAVE_CART',
          cart: {
            id: `cart-${index}`,
            label: `Carrito ${index}`,
            savedAt: new Date(2026, 0, index + 1).toISOString(),
            items: [item],
          },
        }),
      createInitialAccountDemoState()
    );

    expect(state.savedCarts).toHaveLength(MAX_DEMO_SAVED_CARTS);
    expect(state.savedCarts[0].id).toBe(`cart-${MAX_DEMO_SAVED_CARTS + 1}`);
  });

  it('rejects unknown storage versions and invalid stored content', () => {
    expect(normalizeAccountDemoState({ version: 99, isAuthenticated: true })).toEqual(
      createInitialAccountDemoState()
    );

    const normalized = normalizeAccountDemoState({
      ...createInitialAccountDemoState(),
      pets: [{ id: 'bad', name: 'Sin peso' }],
      savedCarts: [{ id: 'empty', items: [] }],
    });

    expect(normalized.pets).toEqual([]);
    expect(normalized.savedCarts).toEqual([]);
  });
});
