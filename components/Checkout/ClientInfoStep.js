'use client';

import { Stack, TextField } from '@mui/material';

const ClientInfoStep = ({
  values,
  errors,
  touched,
  getHelperText,
  onChange,
  onBlur,
}) => {
  const buildErrorState = (field) =>
    Boolean(touched[field] && errors[field]);

  return (
    <Stack spacing={2.5}>
      <TextField
        label="Nombre"
        name="firstName"
        value={values.firstName}
        onChange={onChange}
        onBlur={onBlur}
        error={buildErrorState('firstName')}
        helperText={getHelperText('firstName')}
        fullWidth
      />
      <TextField
        label="Apellidos"
        name="lastName"
        value={values.lastName}
        onChange={onChange}
        onBlur={onBlur}
        error={buildErrorState('lastName')}
        helperText={getHelperText('lastName')}
        fullWidth
      />
      <TextField
        label="Correo electrónico"
        type="email"
        name="email"
        value={values.email}
        onChange={onChange}
        onBlur={onBlur}
        error={buildErrorState('email')}
        helperText={getHelperText('email')}
        fullWidth
      />
      <TextField
        label="Teléfono"
        name="contactPhoneNumber"
        value={values.contactPhoneNumber}
        onChange={onChange}
        onBlur={onBlur}
        error={buildErrorState('contactPhoneNumber')}
        helperText={getHelperText('contactPhoneNumber')}
        fullWidth
        inputProps={{ maxLength: 9 }}
      />
    </Stack>
  );
};

export default ClientInfoStep;
