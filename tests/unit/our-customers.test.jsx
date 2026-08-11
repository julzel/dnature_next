import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import OurCostumers from '../../features/Home/OurCostumers';

describe('Home customer stories', () => {
  it('presents attributed testimonials in a manually controlled carousel', () => {
    render(<OurCostumers />);

    const section = screen.getByRole('region', {
      name: 'Ellos ya viven la experiencia DNAture',
    });

    expect(section).toBeVisible();
    expect(
      screen.getByRole('tablist', { name: 'Seleccionar diapositiva' })
    ).toBeVisible();
    expect(screen.getAllByRole('tabpanel', { hidden: true })).toHaveLength(4);
    expect(screen.getByText('Mario Quesada')).toBeInTheDocument();
    expect(
      screen.getByRole('link', {
        name: 'Ver a @the_adventurous_collies_cr en Instagram',
      })
    ).toHaveAttribute(
      'href',
      'https://instagram.com/the_adventurous_collies_cr'
    );
  });
});
