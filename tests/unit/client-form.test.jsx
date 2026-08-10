import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import ClientFormContainer, {
  clientFieldsForStorage,
  getClientFieldValue,
  inputFields,
  isInputValid,
} from '../../features/Cart/ClientForm/ClientFormContainer';
import storage from '../../features/Cart/lib/browser-storage';

const validClient = {
  firstName: 'Ada',
  lastName: 'Lovelace',
  email: 'ada@example.com',
  address: {
    provincia: 'San José',
    canton: 'Central',
    direccion: 'Calle de prueba',
  },
  contactPhoneNumber: '88888888',
};

describe('checkout form validation', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('reads nested address values through the same validation boundary', () => {
    expect(getClientFieldValue(validClient, 'provincia')).toBe('San José');
    expect(getClientFieldValue(validClient, 'firstName')).toBe('Ada');
    expect(
      inputFields.every((field) =>
        isInputValid(getClientFieldValue(validClient, field.name), field)
      )
    ).toBe(true);
  });

  it.each([
    [undefined, inputFields[0]],
    ['', inputFields[0]],
    ['   ', inputFields[0]],
    ['not-an-email', inputFields.find(({ name }) => name === 'email')],
    ['1234', inputFields.find(({ name }) => name === 'contactPhoneNumber')],
  ])('rejects invalid value %s', (value, field) => {
    expect(isInputValid(value, field)).toBe(false);
  });

  it('keeps submission disabled until every valid field is present', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<ClientFormContainer onSubmit={onSubmit} />);
    const submit = screen.getByRole('button', { name: 'Ok' });

    expect(submit).toBeDisabled();
    await user.type(screen.getByRole('textbox', { name: 'Nombre' }), 'Ada');
    await user.type(screen.getByRole('textbox', { name: 'Apellidos' }), 'Lovelace');
    await user.type(
      screen.getByRole('textbox', { name: 'Correo electrónico' }),
      'ada@example.com'
    );
    await user.type(screen.getByRole('textbox', { name: 'Provincia' }), 'San José');
    await user.type(screen.getByRole('textbox', { name: 'Cantón' }), 'Central');
    await user.type(
      screen.getByRole('textbox', { name: 'Dirección exacta' }),
      'Calle de prueba'
    );

    expect(submit).toBeDisabled();
    await user.type(
      screen.getByRole('textbox', { name: 'Teléfono de contacto' }),
      '88888888'
    );
    expect(submit).toBeEnabled();

    await user.click(submit);
    expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining(validClient));
  });

  it('validates remembered customer data instead of trusting storage', () => {
    storage.setItem(
      'client',
      { ...validClient, address: { ...validClient.address, canton: '' } },
      { expiresInDays: 30 }
    );
    render(<ClientFormContainer onSubmit={vi.fn()} />);

    expect(screen.getByRole('button', { name: 'Ok' })).toBeDisabled();
  });

  it('minimizes remembered customer data before saving it', () => {
    expect(clientFieldsForStorage({ ...validClient, pets: [{ name: 'Luna' }], extra: 'discard' }))
      .toEqual(validClient);
  });

  it('does not duplicate authenticated profile data in browser storage by default', async () => {
    storage.setItem('client', validClient, { expiresInDays: 30 });
    render(
      <ClientFormContainer initialClient={validClient} onSubmit={vi.fn()} />
    );

    expect(
      screen.getByRole('checkbox', {
        name: 'Guardar también estos datos en este dispositivo durante 30 días',
      })
    ).not.toBeChecked();
    await waitFor(() => expect(storage.getItem('client')).toBeNull());
  });
});
