import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const push = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
}));

import Search from '../../features/Search';

const result = {
  id: 'pollo',
  type: 'product',
  title: 'Receta de pollo',
  subtitle: 'Recetas completas',
  href: '/productos/receta-de-pollo',
  image: null,
};

describe('site search', () => {
  beforeEach(() => {
    push.mockReset();
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ results: [result] }),
    });
  });

  it('debounces queries, renders product suggestions, and supports keyboard navigation', async () => {
    const user = userEvent.setup();
    render(<Search id='test-search' />);

    const input = screen.getByRole('combobox', { name: 'Buscar productos' });

    await user.type(input, 'p');
    expect(global.fetch).not.toHaveBeenCalled();

    await user.type(input, 'ollo');

    await waitFor(() =>
      expect(global.fetch).toHaveBeenCalledWith('/api/search/?q=pollo', {
        signal: expect.any(AbortSignal),
      })
    );

    expect(
      await screen.findByRole('link', { name: /Receta de pollo/ })
    ).toHaveAttribute('href', '/productos/receta-de-pollo');

    await user.keyboard('{ArrowDown}{Enter}');
    expect(push).toHaveBeenCalledWith('/productos/receta-de-pollo');
  });

  it('clears the query without sending a one-character request', async () => {
    const user = userEvent.setup();
    render(<Search id='clear-search' />);

    const input = screen.getByRole('combobox', { name: 'Buscar productos' });
    await user.type(input, 'p');
    await user.click(screen.getByRole('button', { name: 'Limpiar búsqueda' }));

    expect(input).toHaveValue('');
    expect(global.fetch).not.toHaveBeenCalled();
  });
});
