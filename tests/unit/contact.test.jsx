import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('../../features/Home/Contact/Map', () => ({
  default: () => <div data-testid='store-map'>Mapa</div>,
}));

import Contact from '../../features/Home/Contact';

describe('Home contact section', () => {
  it('exposes useful contact channels and a direct store-location fallback', () => {
    render(<Contact />);

    expect(
      screen.getByRole('region', {
        name: 'Cuéntanos de tu mascota.',
      })
    ).toBeVisible();
    expect(
      screen.getByText(
        'Lun - Vie, de 8:00 a. m. a 5:00 p. m. Sáb, de 8:00 a. m. a 4:30 p. m.'
      )
    ).toBeVisible();
    expect(screen.getByText('Respondemos dentro de 2 horas hábiles.'))
      .toBeVisible();

    expect(screen.getByRole('link', { name: /Escríbenos por WhatsApp/ }))
      .toHaveAttribute('href', 'https://wa.me/50671848868');
    expect(screen.getByRole('link', { name: /Síguenos en Instagram/ }))
      .toHaveAttribute('href', 'https://www.instagram.com/dnaturecr');
    expect(screen.getByRole('link', { name: /Escríbenos por email/ }))
      .toHaveAttribute('href', 'mailto:info@dnaturefood.com');

    const locationLink = screen.getByRole('link', { name: /Abrir ubicación/ });
    expect(locationLink).toHaveAttribute(
      'href',
      'https://www.google.com/maps/search/?api=1&query=9.955621,-84.085547'
    );
    expect(locationLink).toHaveAttribute('target', '_blank');
  });
});
