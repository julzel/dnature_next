import React from 'react';

const ClientForm = ({ client, handleChange, handleSubmit }) => {
  return (
    <form onSubmit={handleSubmit}>

      <label htmlFor="firstName">First Name:</label>
      <input type="text" name="firstName" value={client.firstName} onChange={handleChange} />

      <label htmlFor="lastName">Last Name:</label>
      <input type="text" name="lastName" value={client.lastName} onChange={handleChange} />

      <label htmlFor="direccion">Address:</label>
      <input type="text" name="direccion" value={client.address.direccion} onChange={handleChange} />

      <label htmlFor="provincia">Province:</label>
      <input type="text" name="provincia" value={client.address.provincia} onChange={handleChange} />

      <label htmlFor="canton">Canton:</label>
      <input type="text" name="canton" value={client.address.canton} onChange={handleChange} />

      <label htmlFor="contactPhoneNumber">Contact Phone Number:</label>
      <input type="text" name="contactPhoneNumber" value={client.contactPhoneNumber} onChange={handleChange} />

      <button type="submit">Submit</button>
    </form>
  );
};

export default ClientForm;
