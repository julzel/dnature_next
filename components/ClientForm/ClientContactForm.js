'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import { storage } from '../../util';

const fieldConfig = [
  { name: 'firstName', label: 'Nombre', required: true },
  { name: 'lastName', label: 'Apellidos', required: true },
  { name: 'provincia', label: 'Provincia', required: true },
  { name: 'canton', label: 'Cantón', required: true },
  {
    name: 'direccion',
    label: 'Dirección exacta',
    required: true,
    multiline: true,
    minRows: 3,
  },
  {
    name: 'email',
    label: 'Correo electrónico',
    type: 'email',
    required: false,
  },
  {
    name: 'contactPhoneNumber',
    label: 'Teléfono de contacto',
    required: false,
    helper: 'Formato 8888-8888 o 88888888',
  },
];

const initialValues = fieldConfig.reduce(
  (acc, field) => ({ ...acc, [field.name]: '' }),
  {}
);

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^(?:\d{4}-\d{4}|\d{8})$/;
const STORAGE_KEY = 'carrito_contacto_cliente';

const ClientContactForm = () => {
  const [values, setValues] = useState(initialValues);
  const [touched, setTouched] = useState({});
  const [rememberClient, setRememberClient] = useState(true);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const savedValues = storage.getItem(STORAGE_KEY);
    if (savedValues) {
      setValues((prev) => ({ ...prev, ...savedValues }));
    }
  }, []);

  const errors = useMemo(() => {
    const nextErrors = {};
    fieldConfig.forEach((field) => {
      const value = values[field.name]?.trim();
      if (field.required && !value) {
        nextErrors[field.name] = `${field.label} es requerido.`;
      }
    });

    const hasEmail = Boolean(values.email?.trim());
    const hasPhone = Boolean(values.contactPhoneNumber?.trim());

    if (!hasEmail && !hasPhone) {
      nextErrors.email =
        'Ingresa al menos un correo electrónico o un número de teléfono.';
      nextErrors.contactPhoneNumber =
        'Ingresa al menos un correo electrónico o un número de teléfono.';
    }

    if (hasEmail && !EMAIL_REGEX.test(values.email.trim())) {
      nextErrors.email = 'Ingresa un correo electrónico válido.';
    }

    if (hasPhone && !PHONE_REGEX.test(values.contactPhoneNumber.trim())) {
      nextErrors.contactPhoneNumber =
        'Ingresa un teléfono en formato 8888-8888 o 88888888.';
    }

    return nextErrors;
  }, [values]);

  const canSubmit = useMemo(() => Object.keys(errors).length === 0, [errors]);

  const handleChange = useCallback((event) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleBlur = useCallback((event) => {
    const { name } = event.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  }, []);

  const handleRememberToggle = useCallback((event) => {
    const { checked } = event.target;
    setRememberClient(checked);
    if (!checked) {
      storage.removeItem(STORAGE_KEY);
    }
  }, []);

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();
      setTouched(
        fieldConfig.reduce((acc, field) => ({ ...acc, [field.name]: true }), {})
      );

      if (!canSubmit) {
        setStatus({
          type: 'error',
          message: 'Revisa los campos marcados en rojo.',
        });
        return;
      }

      if (rememberClient) {
        storage.setItem(STORAGE_KEY, values);
      }

      setStatus({
        type: 'success',
        message: 'Información enviada correctamente.',
      });
    },
    [canSubmit, rememberClient, values]
  );

  const handleCloseAlert = useCallback(() => {
    setStatus(null);
  }, []);

  return (
    <Container maxWidth="sm" component="section" sx={{ py: { xs: 5, md: 8 } }}>
      <Paper
        elevation={4}
        component={Box}
        sx={{
          p: { xs: 3, md: 5 },
          borderRadius: 3,
          backgroundColor: 'background.paper',
        }}
      >
        <Stack spacing={3}>
          <Stack spacing={1}>
            <Typography variant="h4" component="h1">
              Información de contacto
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Completa tus datos para coordinar la entrega de tu pedido. Al
              menos un correo electrónico o un teléfono debe estar presente.
            </Typography>
          </Stack>

          {status && (
            <Alert severity={status.type} onClose={handleCloseAlert}>
              {status.message}
            </Alert>
          )}

          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ width: '100%' }}
          >
            <Stack spacing={2.5}>
              {fieldConfig.map((field) => (
                <TextField
                  key={field.name}
                  name={field.name}
                  label={field.label}
                  type={field.type || 'text'}
                  value={values[field.name]}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required={field.required}
                  fullWidth
                  error={Boolean(touched[field.name] && errors[field.name])}
                  helperText={
                    touched[field.name] && errors[field.name]
                      ? errors[field.name]
                      : field.helper || ' '
                  }
                  multiline={field.multiline}
                  minRows={field.minRows}
                  inputProps={{
                    maxLength:
                      field.name === 'contactPhoneNumber' ? 9 : undefined,
                  }}
                />
              ))}

              <FormControlLabel
                control={
                  <Checkbox
                    checked={rememberClient}
                    onChange={handleRememberToggle}
                    color="primary"
                  />
                }
                label="Recordar mis datos"
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={!canSubmit}
              >
                Enviar
              </Button>
            </Stack>
          </Box>
        </Stack>
      </Paper>
    </Container>
  );
};

export default ClientContactForm;
