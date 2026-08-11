import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import DNAtureSystem from '../../features/Home/DNAtureSystem';

describe('DNAture system section', () => {
  it('explains the approach and offers clear next steps', () => {
    render(<DNAtureSystem />);

    expect(
      screen.getByRole('region', {
        name: 'Una alimentación pensada para su bienestar',
      })
    ).toBeVisible();
    expect(screen.getByRole('link', { name: 'Calculá su porción' }))
      .toHaveAttribute('href', '/calculadora');
    expect(screen.getByRole('link', { name: 'Conocé el plan DNAture' }))
      .toHaveAttribute('href', '/plan-dnature');
    expect(screen.getByRole('list', { name: 'Beneficios que buscamos acompañar' }))
      .toBeVisible();
  });
});
