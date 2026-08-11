import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import CalculatorSteps from '../../features/Calculator/CalculatorSteps';
import {
  buildCalculatorResult,
  getCalculatorSteps,
  selectProfileValue,
} from '../../features/Calculator/model';

const chooseAndContinue = async (user, optionName) => {
  await user.click(screen.getByRole('radio', { name: optionName }));
  await user.click(screen.getByRole('button', { name: 'Siguiente' }));
};

describe('calculator flow', () => {
  it('uses only the fields required by the selected life stage', () => {
    expect(getCalculatorSteps({ age: 'adult' }).map(({ key }) => key)).toEqual([
      'age',
      'size',
      'castrated',
      'bodyContexture',
      'dailyActivity',
      'weight',
    ]);
    expect(getCalculatorSteps({ age: 'puppy' }).map(({ key }) => key)).toEqual([
      'age',
      'puppyStage',
      'weight',
    ]);
  });

  it('clears incompatible dependent answers', () => {
    expect(
      selectProfileValue(
        { age: 'adult', size: 'large' },
        'age',
        'puppy',
      ),
    ).toEqual({ age: 'puppy' });
    expect(
      selectProfileValue(
        { bodyContexture: 'ideal', dailyActivity: 'veryActive' },
        'bodyContexture',
        'overWeight',
      ),
    ).toEqual({ bodyContexture: 'overWeight' });
  });

  it('emits a future-ready pet draft without storing customer data', () => {
    expect(
      buildCalculatorResult(
        {
          age: 'adult',
          size: 'medium',
          castrated: 'notCastrated',
          bodyContexture: 'ideal',
          dailyActivity: 'active',
          weight: '10',
        },
        350,
      ),
    ).toEqual({
      portionGrams: 350,
      petDraft: {
        species: 'dog',
        lifeStage: 'adult',
        puppyStage: null,
        size: 'medium',
        sterilization: 'notCastrated',
        bodyCondition: 'ideal',
        activity: 'active',
        weightKg: 10,
      },
    });
  });

  it('guides an adult profile to a clearly qualified result', async () => {
    const user = userEvent.setup();
    const onResult = vi.fn();
    render(<CalculatorSteps onResult={onResult} />);

    await chooseAndContinue(user, /Adulto/);
    await chooseAndContinue(user, /Pequeño o mediano/);
    await chooseAndContinue(user, 'No está esterilizado/a');
    await chooseAndContinue(user, /Condición ideal/);
    await chooseAndContinue(user, /Regular/);
    await user.type(screen.getByRole('textbox', { name: 'Peso actual' }), '10');
    await user.click(screen.getByRole('button', { name: 'Ver mi porción' }));

    expect(
      screen.getByRole('heading', { name: '350 g al día' }),
    ).toBeVisible();
    expect(screen.getByText(/Es un punto de partida/)).toBeVisible();
    expect(onResult).toHaveBeenCalledWith(
      expect.objectContaining({
        portionGrams: 350,
        petDraft: expect.objectContaining({ species: 'dog', weightKg: 10 }),
      }),
    );
  });
});
