import React, { useState } from "react";

// local imports
// components
import ClientForm from "./ClientForm";

// classes
import { Client } from "../../models/client";

const inputFields = [
  { name: "firstName", label: "Nombre", isRequired: true, type: "text" },
  { name: "lastName", label: "Apellidos", isRequired: true, type: "text" },
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
    type: "tel",
  },
];

const ClientFormContainer = ({ onSubmit, className }) => {
  const [client, setClient] = useState(new Client());
  const [interactedFields, setInteractedFields] = useState({});

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
    onSubmit(client);
  };

  return (
    <ClientForm
      client={client}
      handleBlur={handleBlur}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      isInputValid={isInputValid}
      isFormValid={isFormValid}
      className={className}
      interactedFields={interactedFields}
      inputFields={inputFields}
    />
  );
};

export default ClientFormContainer;
