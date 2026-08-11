import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import Footer, { footerLinks } from '../../components/Footer';

describe('Footer', () => {
  it('provides compact public navigation and direct contact options', () => {
    render(<Footer />);

    const footer = screen.getByRole('contentinfo');
    const navigation = within(footer).getByRole('navigation', {
      name: 'Navegación del pie de página',
    });

    for (const link of footerLinks) {
      expect(within(navigation).getByRole('link', { name: link.label }))
        .toHaveAttribute('href', link.href);
    }

    expect(
      within(footer).getByRole('link', { name: /WhatsApp al \+506 7184-8868/ })
    ).toHaveAttribute('href', 'https://wa.me/50671848868');
    expect(within(footer).getByRole('link', { name: /Colima de Tibás/ }))
      .toHaveAttribute(
        'href',
        'https://www.google.com/maps/search/?api=1&query=9.955621,-84.085547'
      );
    expect(footer).toHaveTextContent(
      `© ${new Date().getFullYear()} DNAture. Todos los derechos reservados.`
    );
  });
});
