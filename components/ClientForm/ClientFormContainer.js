'use client';
import { use, useCallback, useEffect, useState } from 'react';

// local imports
// components
import ClientForm from './ClientForm';

// classes
import { Client } from '../../models/client';

import { storage } from '../../util';

const addressFields = ['provincia', 'canton', 'direccion'];

const inputFields = [
  { name: 'firstName', label: 'Nombre', isRequired: true, type: 'text' },
  { name: 'lastName', label: 'Apellidos', isRequired: true, type: 'text' },
  {
    name: 'email',
    label: 'Correo electrónico',
    isRequired: true,
    type: 'email',
  },
  { name: 'provincia', label: 'Provincia', isRequired: true, type: 'text' },
  { name: 'canton', label: 'Cantón', isRequired: true, type: 'text' },
  {
    name: 'direccion',
    label: 'Dirección exacta',
    isRequired: true,
    type: 'text',
  },
  {
    name: 'contactPhoneNumber',
    label: 'Teléfono de contacto',
    isRequired: true,
    type: 'text',
    pattern: '^(?:\\d{4}-\\d{4}|\\d{8})$', // 8 digits or 4 digits + dash + 4 digits
    maxLength: 9,
  },
];

const ClientFormContainer = ({ onSubmit, className }) => {
  const [rememberClient, setRememberClient] = useState(true);
  const [client, setClient] = useState(
    storage.getItem('client') || new Client()
  );
  const [interactedFields, setInteractedFields] = useState({});

  const handleRememberToggle = useCallback(() => {
    setRememberClient((prevRememberClient) => !prevRememberClient);
  }, []);

  const getFieldValue = useCallback(
    (data, fieldName) =>
      addressFields.includes(fieldName)
        ? data.address?.[fieldName] ?? ''
        : data[fieldName] ?? '',
    [addressFields]
  );

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;

    if (addressFields.includes(name)) {
      setClient((prevClient) => ({
        ...prevClient,
        address: { ...(prevClient.address || {}), [name]: value },
      }));
    } else {
      setClient((prevClient) => ({ ...prevClient, [name]: value }));
    }
  }, []);

  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setInteractedFields((prev) => ({ ...prev, [name]: true }));
  }, []);

  const isInputValid = useCallback(
    (value, isRequired) => (isRequired ? value?.trim() !== '' : true),
    []
  );

  const isFormValid = useCallback(() => {
    return inputFields.every((field) =>
      isInputValid(getFieldValue(client, field.name), field.isRequired)
    );
  }, [client, isInputValid]);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      // Perform necessary actions with the client information
      if (rememberClient) {
        storage.setItem('client', client);
      }
      onSubmit(client);
    },
    [client, rememberClient, onSubmit]
  );

  useEffect(() => {
    if (!rememberClient) {
      storage.removeItem('client');
    }
  }, [rememberClient]);

  return (
    <ClientForm
      client={client}
      handleBlur={handleBlur}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      handleRememberToggle={handleRememberToggle}
      isInputValid={isInputValid}
      isFormValid={isFormValid}
      className={className}
      interactedFields={interactedFields}
      inputFields={inputFields}
      rememberClient={rememberClient}
      addressFields={addressFields}
    />
  );
};

export default ClientFormContainer;
