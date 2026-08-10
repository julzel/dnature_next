import React, { useEffect, useState } from "react";

// local imports
// components
import ClientForm from "./ClientForm";

import storage from "../lib/browser-storage";
import { COSTA_RICA_PROVINCES } from '../../../constants/costa-rica';

const contactFields = [
  {
    name: 'firstName',
    label: 'Nombre',
    isRequired: true,
    type: 'text',
    autoComplete: 'given-name',
    maxLength: 80,
  },
  {
    name: 'lastName',
    label: 'Apellidos',
    isRequired: true,
    type: 'text',
    autoComplete: 'family-name',
    maxLength: 120,
  },
  {
    name: "email",
    label: "Correo electrónico",
    isRequired: true,
    type: "email",
    autoComplete: 'email',
    maxLength: 254,
  },
  {
    name: 'contactPhoneNumber',
    label: 'Teléfono de contacto',
    isRequired: true,
    type: 'tel',
    inputMode: 'numeric',
    autoComplete: 'tel-national',
    pattern: '^(?:\\d{4}-\\d{4}|\\d{8})$',
    maxLength: 9,
  },
];

const deliveryFields = [
  {
    name: 'provincia',
    label: 'Provincia',
    isRequired: true,
    type: 'select',
    autoComplete: 'address-level1',
    options: COSTA_RICA_PROVINCES,
  },
  {
    name: 'canton',
    label: 'Cantón',
    isRequired: true,
    type: 'text',
    autoComplete: 'address-level2',
    maxLength: 100,
  },
  {
    name: 'distrito',
    label: 'Distrito',
    isRequired: false,
    type: 'text',
    autoComplete: 'address-level3',
    maxLength: 100,
  },
  {
    name: "direccion",
    label: "Señas de la dirección",
    isRequired: true,
    type: "text",
    autoComplete: 'street-address',
    maxLength: 500,
  },
  {
    name: 'notasEntrega',
    label: 'Indicaciones adicionales',
    isRequired: false,
    type: "text",
    maxLength: 300,
    autoComplete: 'off',
  },
];

const inputFields = [...contactFields, ...deliveryFields];
const addressFieldNames = new Set(
  deliveryFields.map(({ name }) => name)
);
const REMEMBERED_CLIENT_RETENTION_DAYS = 30;

const getClientFieldValue = (client, fieldName) =>
  addressFieldNames.has(fieldName)
    ? client.address?.[fieldName]
    : client[fieldName];

const isInputValid = (value, field) => {
  const normalizedValue = typeof value === 'string' ? value.trim() : '';

  if (field.isRequired && !normalizedValue) {
    return false;
  }

  if (!normalizedValue) {
    return true;
  }

  if (field.maxLength && normalizedValue.length > field.maxLength) {
    return false;
  }

  if (field.type === 'select') {
    return field.options.includes(normalizedValue);
  }

  if (field.type === 'email') {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedValue);
  }

  return field.pattern ? new RegExp(field.pattern).test(normalizedValue) : true;
};

const validationMessage = (value, field) => {
  const normalizedValue = typeof value === 'string' ? value.trim() : '';

  if (field.isRequired && !normalizedValue) {
    return `Ingresá ${field.label.toLowerCase()}.`;
  }
  if (field.type === 'email') {
    return 'Ingresá un correo electrónico válido.';
  }
  if (field.name === 'contactPhoneNumber') {
    return 'Ingresá un teléfono de Costa Rica de 8 dígitos.';
  }
  return `Revisá ${field.label.toLowerCase()}.`;
};

const createClient = (savedClient) => {
  const client = savedClient || {};

  return {
    firstName: client.firstName || "",
    lastName: client.lastName || "",
    email: client.email || "",
    address: {
      direccion: "",
      provincia: "",
      canton: "",
      distrito: '',
      notasEntrega: '',
      ...client.address,
    },
    contactPhoneNumber: client.contactPhoneNumber || "",
    pets: Array.isArray(client.pets) ? client.pets : [],
  };
};

const clientFieldsForStorage = (client) => ({
  firstName: client.firstName,
  lastName: client.lastName,
  email: client.email,
  address: {
    direccion: client.address?.direccion,
    provincia: client.address?.provincia,
    canton: client.address?.canton,
    distrito: client.address?.distrito,
    notasEntrega: client.address?.notasEntrega,
  },
  contactPhoneNumber: client.contactPhoneNumber,
});

const ClientFormContainer = ({
  onSubmit,
  className,
  initialClient = null,
  requiresAddress = false,
}) => {
  const [rememberedClient] = useState(() =>
    initialClient ? null : storage.getItem('client')
  );
  const [rememberClient, setRememberClient] = useState(
    Boolean(rememberedClient)
  );
  const [client, setClient] = useState(() =>
    createClient(initialClient || rememberedClient)
  );
  const [interactedFields, setInteractedFields] = useState({});
  const checkoutFields = requiresAddress
    ? [...contactFields, ...deliveryFields]
    : contactFields;

  const handleRememberToggle = () => {
    setRememberClient((prevRememberClient) => !prevRememberClient);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (addressFieldNames.has(name)) {
      setClient((prevClient) => ({
        ...prevClient,
        address: { ...prevClient.address, [name]: value },
      }));
    } else {
      setClient((prevClient) => ({ ...prevClient, [name]: value }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setInteractedFields((previousFields) => ({ ...previousFields, [name]: true }));
  };

  const isFormValid = () => {
    return checkoutFields.every((field) =>
      isInputValid(getClientFieldValue(client, field.name), field)
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormValid()) {
      setInteractedFields(
        checkoutFields.reduce((fields, field) => ({ ...fields, [field.name]: true }), {})
      );
      return;
    }

    const normalizedClient = {
      ...client,
      firstName: client.firstName.trim(),
      lastName: client.lastName.trim(),
      email: client.email.trim(),
      contactPhoneNumber: client.contactPhoneNumber.trim(),
      address: Object.fromEntries(
        Object.entries(client.address || {}).map(([key, value]) => [
          key,
          typeof value === 'string' ? value.trim() : value,
        ])
      ),
    };

    if (rememberClient) {
      storage.setItem('client', clientFieldsForStorage(normalizedClient), {
        expiresInDays: REMEMBERED_CLIENT_RETENTION_DAYS,
      });
    }
    onSubmit(normalizedClient);
  };

  useEffect(() => {
    if (!rememberClient) {
      storage.removeItem("client");
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
      inputFields={checkoutFields}
      requiresAddress={requiresAddress}
      rememberClient={rememberClient}
      rememberLabel={
        initialClient
          ? 'Guardar también estos datos en este dispositivo durante 30 días'
          : 'Recordar mis datos durante 30 días'
      }
      showAccountPrompt={!initialClient}
      validationMessage={validationMessage}
    />
  );
};

export {
  clientFieldsForStorage,
  getClientFieldValue,
  inputFields,
  isInputValid,
  validationMessage,
  REMEMBERED_CLIENT_RETENTION_DAYS,
};

export default ClientFormContainer;
