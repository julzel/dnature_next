import React from "react";

// local imports
// components
import Button from "../Button";

// styles
import styles from "./ClientForm.module.scss";

const ClientForm = ({ client, handleChange, handleSubmit, className }) => {
  return (
    <div className={`${styles.clientForm} ${className ? className : ""}`}>
      <div>
        <h2>Detalles de entrega:</h2>
      </div>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="firstName">Nombre:</label>
          <input
            type="text"
            name="firstName"
            value={client.firstName}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="lastName">Apellidos:</label>
          <input
            type="text"
            name="lastName"
            value={client.lastName}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="provincia">Provincia:</label>
          <input
            type="text"
            name="provincia"
            value={client.address.provincia}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="canton">Cantón:</label>
          <input
            type="text"
            name="canton"
            value={client.address.canton}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="direccion">Dirección exacta:</label>
          <input
            type="text"
            name="direccion"
            value={client.address.direccion}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="contactPhoneNumber">Contactar al:</label>
          <input
            type="text"
            name="contactPhoneNumber"
            value={client.contactPhoneNumber}
            onChange={handleChange}
          />
        </div>

        <Button type="submit">Ok</Button>
      </form>
    </div>
  );
};

export default ClientForm;
