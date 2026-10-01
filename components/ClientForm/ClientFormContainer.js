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

const normalizeClient = (client) => {
  const savedClient = client ?? {};

  return new Client(
    savedClient.firstName ?? "",
    savedClient.lastName ?? "",
    savedClient.email ?? "",
    savedClient.address ?? {},
    savedClient.contactPhoneNumber ?? "",
    savedClient.pets ?? []
  );
};

const addressFields = new Set(["direccion", "provincia", "canton"]);

const ClientFormContainer = ({ onSubmit, className }) => {
  const [rememberClient, setRememberClient] = useState(true);
  const [client, setClient] = useState(() =>
    normalizeClient(storage.getItem("client"))
  );
  const [interactedFields, setInteractedFields] = useState({});

  const handleRememberToggle = () => {
    setRememberClient((prevRememberClient) => !prevRememberClient);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (addressFields.has(name)) {
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
    isRequired ? typeof value === "string" && value.trim() !== "" : true;

  const isFormValid = () => {
    // Check if all required fields have values
    return inputFields.every((field) => {
      const value = addressFields.has(field.name)
        ? client.address?.[field.name]
        : client[field.name];
      return isInputValid(value, field.isRequired);
    });
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
