import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import FaqList from '../../features/Faq/FaqList';
import { faqCategories } from '../../features/Faq/FaqList/data';

describe('FAQ', () => {
  it('exposes every customer-service topic in seven navigable categories', () => {
    render(<FaqList />);

    expect(faqCategories).toHaveLength(7);
    expect(faqCategories.flatMap((category) => category.items)).toHaveLength(65);
    expect(screen.getByText('65 respuestas encontradas')).toBeVisible();
    expect(
      screen.getByRole('heading', { name: 'Alimentación natural' }),
    ).toBeVisible();
    expect(
      screen.getByRole('heading', { name: 'Para gatos' }),
    ).toBeVisible();
  });

  it('searches questions and answers without requiring accent marks', async () => {
    const user = userEvent.setup();
    render(<FaqList />);

    await user.type(
      screen.getByRole('searchbox', { name: 'Buscar en preguntas frecuentes' }),
      'estruvita',
    );

    expect(screen.getByText('1 respuesta encontrada')).toBeVisible();
    expect(
      screen.getByRole('button', {
        name: '¿Pueden hacer una dieta para perros con cristales de estruvita?',
      }),
    ).toBeVisible();
    expect(
      screen.queryByRole('button', {
        name: '¿Cuánto dura la comida en refrigeración?',
      }),
    ).not.toBeInTheDocument();
  });

  it('filters by category and reports the resulting count', async () => {
    const user = userEvent.setup();
    render(<FaqList />);

    const mobileFilters = screen.getByLabelText('Filtrar por tema');
    await user.click(within(mobileFilters).getByRole('button', { name: /Gatos/ }));

    expect(screen.getByText('5 respuestas encontradas')).toBeVisible();
    expect(
      screen.getByRole('heading', { name: 'Para gatos' }),
    ).toBeVisible();
    expect(
      screen.queryByRole('heading', { name: 'Alimentación natural' }),
    ).not.toBeInTheDocument();
  });

  it('associates each accordion answer with its trigger', async () => {
    const user = userEvent.setup();
    render(<FaqList />);
    const trigger = screen.getByRole('button', {
      name: '¿Qué es la alimentación natural para perros y gatos?',
    });

    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await user.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');

    const answer = screen.getByRole('region', {
      name: '¿Qué es la alimentación natural para perros y gatos?',
    });
    expect(answer).toBeVisible();
    expect(answer).toHaveTextContent('ingredientes reales y seleccionados');

    await user.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('offers recovery when a search has no results', async () => {
    const user = userEvent.setup();
    render(<FaqList />);

    await user.type(
      screen.getByRole('searchbox', { name: 'Buscar en preguntas frecuentes' }),
      'respuesta inexistente',
    );

    expect(screen.getByText('0 respuestas encontradas')).toBeVisible();
    expect(
      screen.getByRole('heading', { name: 'No encontramos esa respuesta' }),
    ).toBeVisible();
    expect(
      screen.getByRole('link', { name: 'Preguntar por WhatsApp' }),
    ).toHaveAttribute('href', 'https://wa.me/50671848868');

    await user.click(screen.getByRole('button', { name: 'Ver todas las preguntas' }));
    expect(screen.getByText('65 respuestas encontradas')).toBeVisible();
  });
});
