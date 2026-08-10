import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import ClientFormContainer, {
  clientFieldsForStorage,
  getClientFieldValue,
  inputFields,
  isInputValid,
  validationMessage,
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

const fillContactFields = async (user) => {
  await user.type(screen.getByRole('textbox', { name: 'Nombre' }), 'Ada');
  await user.type(screen.getByRole('textbox', { name: 'Apellidos' }), 'Lovelace');
  await user.type(
    screen.getByRole('textbox', { name: 'Correo electrónico' }),
    'ada@example.com'
  );
  await user.type(
    screen.getByRole('textbox', { name: 'Teléfono de contacto' }),
    '88888888'
  );
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
    ['Provincia inventada', inputFields.find(({ name }) => name === 'provincia')],
  ])('rejects invalid value %s', (value, field) => {
    expect(isInputValid(value, field)).toBe(false);
  });

  it('allows coordinated pickup with contact data and no delivery address', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<ClientFormContainer onSubmit={onSubmit} />);
    const submit = screen.getByRole('button', { name: 'Revisar solicitud' });

    expect(submit).toBeDisabled();
    expect(
      screen.getByRole('heading', { name: 'Datos de contacto' })
    ).toBeVisible();
    expect(screen.queryByLabelText(/Provincia/)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/Cantón/)).not.toBeInTheDocument();
    expect(
      screen.queryByLabelText(/Señas de la dirección/)
    ).not.toBeInTheDocument();

    await fillContactFields(user);
    expect(submit).toBeEnabled();

    await user.click(submit);
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        firstName: 'Ada',
        lastName: 'Lovelace',
        email: 'ada@example.com',
        contactPhoneNumber: '88888888',
        address: expect.objectContaining({
          provincia: '',
          canton: '',
          direccion: '',
        }),
      })
    );
  });

  it('requires a Costa Rican delivery address when delivery is selected', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(
      <ClientFormContainer
        onSubmit={onSubmit}
        requiresAddress
      />
    );
    const submit = screen.getByRole('button', { name: 'Revisar solicitud' });

    expect(
      screen.getByRole('heading', { name: 'Datos para la entrega' })
    ).toBeVisible();
    await fillContactFields(user);
    expect(submit).toBeDisabled();

    await user.selectOptions(screen.getByLabelText(/Provincia/), 'San José');
    await user.type(screen.getByRole('textbox', { name: 'Cantón' }), 'Central');
    await user.type(
      screen.getByRole('textbox', { name: 'Señas de la dirección' }),
      'Calle de prueba'
    );
    await user.type(screen.getByRole('textbox', { name: 'Distrito' }), 'Carmen');
    await user.type(
      screen.getByRole('textbox', { name: 'Indicaciones adicionales' }),
      'Portón verde'
    );
    expect(submit).toBeEnabled();

    await user.click(submit);
    expect(onSubmit).toHaveBeenCalledOnce();
    expect(onSubmit.mock.calls[0][0]).toMatchObject({
      ...validClient,
      address: {
        ...validClient.address,
        distrito: 'Carmen',
        notasEntrega: 'Portón verde',
      },
    });
  });

  it('validates remembered customer data instead of trusting storage', () => {
    storage.setItem(
      'client',
      { ...validClient, address: { ...validClient.address, canton: '' } },
      { expiresInDays: 30 }
    );
    render(<ClientFormContainer onSubmit={vi.fn()} requiresAddress />);

    expect(
      screen.getByRole('button', { name: 'Revisar solicitud' })
    ).toBeDisabled();
  });

  it('keeps a previous guest opt-in selected until the customer clears it', () => {
    storage.setItem('client', validClient, { expiresInDays: 30 });
    render(<ClientFormContainer onSubmit={vi.fn()} />);

    expect(
      screen.getByRole('checkbox', {
        name: 'Recordar mis datos durante 30 días',
      })
    ).toBeChecked();
    expect(storage.getItem('client')).toMatchObject(validClient);
  });

  it('minimizes remembered customer data before saving it', () => {
    expect(clientFieldsForStorage({ ...validClient, pets: [{ name: 'Luna' }], extra: 'discard' }))
      .toEqual({
        ...validClient,
        address: {
          ...validClient.address,
          distrito: undefined,
          notasEntrega: undefined,
        },
      });
  });

  it('uses specific validation guidance for email and Costa Rican phone', () => {
    const emailField = inputFields.find(({ name }) => name === 'email');
    const phoneField = inputFields.find(
      ({ name }) => name === 'contactPhoneNumber'
    );

    expect(validationMessage('correo-invalido', emailField)).toBe(
      'Ingresá un correo electrónico válido.'
    );
    expect(validationMessage('1234', phoneField)).toBe(
      'Ingresá un teléfono de Costa Rica de 8 dígitos.'
    );
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
