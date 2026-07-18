import { describe, expect, it } from 'vitest';

import { normalizeClientPets, normalizePets } from '../../util/pets';

describe('saved pet identity migration', () => {
  it('assigns deterministic IDs to legacy pets', () => {
    const legacyPets = [
      { name: 'Luna', age: 'adult', weight: '10' },
      { name: 'Sol', age: 'puppy', weight: '5' },
    ];

    expect(normalizePets(legacyPets)).toEqual(normalizePets(legacyPets));
    expect(normalizePets(legacyPets).every(({ id }) => id.startsWith('legacy-pet-'))).toBe(
      true
    );
  });

  it('preserves existing IDs and resolves duplicate legacy IDs', () => {
    const normalized = normalizePets([
      { id: 'pet-1', name: 'Luna' },
      { id: 'pet-1', name: 'Sol' },
    ]);

    expect(normalized.map(({ id }) => id)).toEqual(['pet-1', 'pet-1-1']);
  });

  it('migrates malformed client pet storage safely', () => {
    expect(normalizeClientPets({ firstName: 'Ada', pets: null })).toEqual({
      firstName: 'Ada',
      pets: [],
    });
  });
});
