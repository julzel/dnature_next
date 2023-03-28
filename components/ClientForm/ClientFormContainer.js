import React, { useEffect, useState } from "react";

// local imports
// components
import ClientForm from "./ClientForm";

// classes
import { Client } from "../../models/client";

import { storage } from "../../util";

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

const ClientFormContainer = ({ onSubmit, className }) => {
  const [rememberClient, setRememberClient] = useState(true);
  const [client, setClient] = useState(
    storage.getItem("client") || new Client()
  );
  const [interactedFields, setInteractedFields] = useState({});

  const handleRememberToggle = () => {
    setRememberClient((prevRememberClient) => !prevRememberClient);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (["direccion", "provincia", "canton"].includes(name)) {
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
    setInteractedFields({ ...interactedFields, [name]: true });
  };

  const isInputValid = (value, isRequired) =>
    isRequired ? value?.trim() !== "" : true;

  const isFormValid = () => {
    // Check if all required fields have values
    return inputFields.every((field) =>
      isInputValid(client[field.name], field.isRequired)
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Perform necessary actions with the client information
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
