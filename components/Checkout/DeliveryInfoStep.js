'use client';

import { Checkbox, FormControlLabel, Stack, TextField } from '@mui/material';

const DeliveryInfoStep = ({
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
        label="Provincia"
        name="provincia"
        value={values.provincia}
        onChange={onChange}
        onBlur={onBlur}
        error={buildErrorState('provincia')}
        helperText={getHelperText('provincia')}
        fullWidth
      />
      <TextField
        label="Cantón"
        name="canton"
        value={values.canton}
        onChange={onChange}
        onBlur={onBlur}
        error={buildErrorState('canton')}
        helperText={getHelperText('canton')}
        fullWidth
      />
      <TextField
        label="Dirección exacta"
        name="direccion"
        value={values.direccion}
        onChange={onChange}
        onBlur={onBlur}
        error={buildErrorState('direccion')}
        helperText={getHelperText('direccion')}
        fullWidth
        multiline
        minRows={3}
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={values.rememberClient}
            onChange={onChange}
            name="rememberClient"
            color="primary"
          />
        }
        label="Recordar mis datos para la próxima compra"
      />
    </Stack>
  );
};

export default DeliveryInfoStep;
