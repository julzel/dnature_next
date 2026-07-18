import React, { useEffect, useState } from "react";

// local imports
// components
import ClientForm from "./ClientForm";

// classes
import { Client } from "../../models/client";

import storage from "../../util/storage";

const inputFields = [
  { name: "firstName", label: "Nombre", isRequired: true, type: "text" },
  { name: "lastName", label: "Apellidos", isRequired: true, type: "text" },
  {
    name: "email",
    label: "Correo electrónico",
    isRequired: true,
    type: "email",
  },
  { name: "provincia", label: "Provincia", isRequired: true, type: "text" },
  { name: "canton", label: "Cantón", isRequired: true, type: "text" },
  {
    name: "direccion",
    label: "Dirección exacta",
    isRequired: true,
    type: "text",
  },
  {
    name: "contactPhoneNumber",
    label: "Teléfono de contacto",
    isRequired: true,
    type: "text",
    pattern: "^(?:\\d{4}-\\d{4}|\\d{8})$", // 8 digits or 4 digits + dash + 4 digits
    maxLength: 9,
  },
];

const addressFieldNames = new Set(['direccion', 'provincia', 'canton']);

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

  if (field.type === 'email') {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedValue);
  }

  return field.pattern ? new RegExp(field.pattern).test(normalizedValue) : true;
};

const createClient = (savedClient) =>
  new Client(
    savedClient?.firstName,
    savedClient?.lastName,
    savedClient?.email,
    savedClient?.address,
    savedClient?.contactPhoneNumber,
    savedClient?.pets
  );

const ClientFormContainer = ({ onSubmit, className }) => {
  const [rememberClient, setRememberClient] = useState(true);
  const [client, setClient] = useState(() => createClient(storage.getItem('client')));
  const [interactedFields, setInteractedFields] = useState({});

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
    return inputFields.every((field) =>
      isInputValid(getClientFieldValue(client, field.name), field)
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormValid()) {
      setInteractedFields(
        inputFields.reduce((fields, field) => ({ ...fields, [field.name]: true }), {})
      );
      return;
    }

    if (rememberClient) {
      storage.setItem("client", client);
    }
    onSubmit(client);
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
      inputFields={inputFields}
      rememberClient={rememberClient}
    />
  );
};

export default ClientFormContainer;
