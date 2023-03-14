import React, { useState } from "react";

// local imports
// components
import ClientForm from "./ClientForm";

// classes
import { Client } from "../../models/client";

const ClientFormContainer = ({ onSubmit }) => {
  const [client, setClient] = useState(new Client());

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "direccion" || name === "provincia" || name === "canton") {
      setClient({
        ...client,
        address: { ...client.address, [name]: value },
      });
    } else {
      setClient({
        ...client,
        [name]: value,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Perform necessary actions with the client information
    onSubmit(client);
  };

  return (
    <ClientForm
      client={client}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
    />
  );
};

export default ClientFormContainer;
