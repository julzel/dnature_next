import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import Products from '../../features/Home/Products';
import Welcome from '../../features/Home/Welcome';

const categories = [
  {
    label: 'Recetas completas',
    slug: 'recetas',
    image: { title: 'Receta natural', url: '/images/category-diet.jpg' },
  },
  {
    label: 'Snacks',
    slug: 'snacks',
    image: { title: 'Snacks naturales', url: '/images/category-snack.jpg' },
  },
];

describe('Home product discovery', () => {
  it('links valid categories and the complete catalogue', () => {
    render(<Products categories={categories} />);

    const section = screen.getByRole('region', { name: 'Nuestros productos' });
    expect(within(section).getByRole('link', { name: 'Ver todo el catálogo' }))
      .toHaveAttribute('href', '/productos');
    expect(within(section).getByRole('link', { name: /Recetas completas/ }))
      .toHaveAttribute('href', '/productos?category=recetas');
    expect(within(section).getByRole('link', { name: /Snacks/ }))
      .toHaveAttribute('href', '/productos?category=snacks');
  });
});

describe('Home welcome section', () => {
  it('presents the three product principles without absolute health claims', () => {
    render(<Welcome />);

    const section = screen.getByRole('region', {
      name: 'Comida real, preparada con intención',
    });
    expect(within(section).getByRole('heading', { name: 'Natural' })).toBeVisible();
    expect(within(section).getByRole('heading', { name: 'Balanceada' })).toBeVisible();
    expect(within(section).getByRole('heading', { name: 'Cruda' })).toBeVisible();
    expect(
      within(section).getByAltText(
        'Plato de alimentación natural con distintas proteínas e ingredientes frescos'
      )
    ).toBeVisible();
    expect(section).toHaveTextContent('Ingredientes que podés reconocer');
    expect(section).not.toHaveTextContent('la opción más saludable');
    expect(section).not.toHaveTextContent('te aseguras');
  });
});
