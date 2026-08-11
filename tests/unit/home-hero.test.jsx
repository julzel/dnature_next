import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import Hero from '../../features/Home/Hero';

describe('Home Hero', () => {
  it('presents the proposition, next steps, and readable trust signals', () => {
    render(<Hero />);

    const hero = screen.getByRole('region', {
      name: 'La forma natural de alimentar a tu mascota',
    });
    expect(within(hero).getByRole('link', { name: 'Explorar productos' }))
      .toHaveAttribute('href', '/productos');
    expect(
      within(hero).getByRole('list', { name: 'Beneficios de nuestros productos' })
    ).toBeVisible();
    expect(within(hero).getByAltText('Perro junto a un tazón de alimento natural'))
      .toBeVisible();
    expect(hero.querySelector('source[media="(max-width: 767px)"]'))
      .toHaveAttribute('srcset', expect.stringContaining('hero3_wide'));
  });
});
