import { describe, expect, it } from 'vitest';

import {
  MAX_PET_WEIGHT_KG,
  MIN_PET_WEIGHT_KG,
  calculatePortionSizeInGrams,
  isSupportedPortionProfile,
  isValidPetWeight,
} from '../../util/portion-size';
import {
  adultPortionMatrix,
  supportedAdultProfiles,
  unsupportedAdultProfiles,
} from '../fixtures/portion-matrix';
import { getDailyActivityOptions } from '../../features/PlanDNA/PetData/questions';

describe('portion-size domain matrix', () => {
  it('enumerates every adult input combination', () => {
    expect(adultPortionMatrix).toHaveLength(54);
    expect(supportedAdultProfiles).toHaveLength(48);
    expect(unsupportedAdultProfiles).toHaveLength(6);
  });

  it.each(supportedAdultProfiles)(
    'calculates a finite result for $size/$castrated/$bodyContexture/$dailyActivity',
    (profile) => {
      expect(isSupportedPortionProfile(profile)).toBe(true);
      expect(calculatePortionSizeInGrams(profile)).toSatisfy(
        (value) => Number.isFinite(value) && value > 0
      );
    }
  );

  it.each(unsupportedAdultProfiles)(
    'records $size/$castrated/$bodyContexture/$dailyActivity as unsupported',
    (profile) => {
      expect(isSupportedPortionProfile(profile)).toBe(false);
      expect(calculatePortionSizeInGrams(profile)).toBeNull();
    }
  );

  it.each([
    ['stage1', 1000],
    ['stage2', 700],
    ['stage3', 400],
  ])('supports puppy %s', (puppyStage, expected) => {
    const profile = { age: 'puppy', puppyStage, weight: 10 };
    expect(isSupportedPortionProfile(profile)).toBe(true);
    expect(calculatePortionSizeInGrams(profile)).toBe(expected);
  });

  it('supports legacy calculator values', () => {
    expect(
      calculatePortionSizeInGrams({
        age: 'adulto',
        size: 'pequeno',
        castrated: 'noCastrado',
        weightStatus: 'pesoIdeal',
        activity: 'activo',
        weight: 10,
      })
    ).toBe(400);
  });

  it.each([NaN, Infinity, -1, 0, 100.1, '', null, undefined])(
    'rejects invalid weight %s',
    (weight) => {
      expect(isValidPetWeight(weight)).toBe(false);
    }
  );

  it.each([MIN_PET_WEIGHT_KG, 10, MAX_PET_WEIGHT_KG])(
    'accepts bounded weight %s',
    (weight) => {
      expect(isValidPetWeight(weight)).toBe(true);
    }
  );

  it('does not expose the unapproved overweight/very-active combination', () => {
    expect(
      getDailyActivityOptions('overWeight').map(({ value }) => value)
    ).toEqual(['sedentary', 'active']);
    expect(
      getDailyActivityOptions('ideal').map(({ value }) => value)
    ).toContain('veryActive');
  });
});
