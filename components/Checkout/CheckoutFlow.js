'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  Stack,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from '@mui/material';

import { useCartContext } from '../../contexts/shopping-cart-context';
import PurchaseOrderContainer from '../../features/Cart/PurchaseOrder';
import CartNotification from '../../features/Cart/CartNotification';
import {
  storage,
  captureElementScreenshot,
  downloadScreenShot,
} from '../../util';

const steps = [
  'Datos del cliente',
  'Información de entrega',
  'Resumen del pedido',
];

const STEP_FIELDS = [
  ['firstName', 'lastName', 'email', 'contactPhoneNumber'],
  ['provincia', 'canton', 'direccion'],
  [],
];

const FIELD_LABELS = {
  firstName: 'Nombre',
  lastName: 'Apellidos',
  email: 'Correo electrónico',
  contactPhoneNumber: 'Teléfono',
  provincia: 'Provincia',
  canton: 'Cantón',
  direccion: 'Dirección exacta',
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^(?:\d{4}-\d{4}|\d{8})$/;
const STORAGE_KEY = 'checkout_client_info';

const defaultValues = {
  firstName: '',
  lastName: '',
  email: '',
  contactPhoneNumber: '',
  provincia: '',
  canton: '',
  direccion: '',
  rememberClient: true,
};

const CheckoutFlow = () => {
  const { cart, updateCartClient, storeCartInLocalStorage } = useCartContext();
  const orderPreviewRef = useRef(null);
  const [activeStep, setActiveStep] = useState(0);
  const [values, setValues] = useState(defaultValues);
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState(null);
  const [isGeneratingOrder, setIsGeneratingOrder] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    const savedClient = storage.getItem(STORAGE_KEY);
    if (savedClient) {
      setValues((prev) => ({ ...prev, ...savedClient }));
    }
  }, []);

  useEffect(() => {
    if (cart?.client?.firstName) {
      setValues((prev) => ({
        ...prev,
        firstName: cart.client.firstName ?? prev.firstName,
        lastName: cart.client.lastName ?? prev.lastName,
        email: cart.client.email ?? prev.email,
        contactPhoneNumber:
          cart.client.contactPhoneNumber ?? prev.contactPhoneNumber,
        provincia: cart.client.address?.provincia ?? prev.provincia,
        canton: cart.client.address?.canton ?? prev.canton,
        direccion: cart.client.address?.direccion ?? prev.direccion,
      }));
    }
  }, [cart?.client]);

  const errors = useMemo(() => {
    const validationErrors = {};
    Object.keys(FIELD_LABELS).forEach((field) => {
      const value = values[field]?.trim();
      if (!value) {
        validationErrors[field] = `${FIELD_LABELS[field]} es obligatorio.`;
        return;
      }
      if (field === 'email' && value && !EMAIL_REGEX.test(value)) {
        validationErrors[field] = 'Ingresa un correo válido.';
      }
      if (field === 'contactPhoneNumber' && value && !PHONE_REGEX.test(value)) {
        validationErrors[field] = 'Usa el formato 8888-8888 o 88888888.';
      }
    });
    return validationErrors;
  }, [values]);

  const isStepValid = (stepIndex) => {
    const stepFields = STEP_FIELDS[stepIndex];
    if (!stepFields.length) {
      return true;
    }
    return stepFields.every((field) => !errors[field]);
  };

  const markStepAsTouched = (stepIndex) => {
    const stepFields = STEP_FIELDS[stepIndex];
    setTouched((prev) => ({
      ...prev,
      ...stepFields.reduce(
        (acc, field) => ({
          ...acc,
          [field]: true,
        }),
        {}
      ),
    }));
  };

  const persistClient = () => {
    const clientPayload = {
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      email: values.email.trim(),
      contactPhoneNumber: values.contactPhoneNumber.trim(),
      address: {
        provincia: values.provincia.trim(),
        canton: values.canton.trim(),
        direccion: values.direccion.trim(),
      },
    };
    updateCartClient(clientPayload);
    if (values.rememberClient) {
      storage.setItem(STORAGE_KEY, values);
    } else {
      storage.removeItem(STORAGE_KEY);
    }
  };

  const handleNext = () => {
    setStatus(null);
    if (!isStepValid(activeStep)) {
      markStepAsTouched(activeStep);
      return;
    }

    if (activeStep === 1) {
      persistClient();
    }

    setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handleBack = () => {
    setStatus(null);
    setActiveStep((prev) => Math.max(prev - 1, 0));
  };

  const handleFinish = async () => {
    if (!cart.items.length) {
      setStatus({
        type: 'error',
        message: 'Tu carrito está vacío. Agrega productos para continuar.',
      });
      return;
    }

    setStatus(null);
    persistClient();
    setShowNotification(true);
    setIsGeneratingOrder(true);

    try {
      storeCartInLocalStorage();
      if (orderPreviewRef.current) {
        const dataUrl = await captureElementScreenshot(orderPreviewRef.current);
        if (dataUrl) {
          downloadScreenShot(dataUrl, 'orden-dnature.png');
        } else {
          setStatus({
            type: 'error',
            message:
              'Hubo un problema al generar la orden. Intenta de nuevo en unos segundos.',
          });
        }
      }
    } catch (error) {
      setStatus({
        type: 'error',
        message: 'No pudimos generar la orden. Intenta nuevamente.',
      });
    } finally {
      setIsGeneratingOrder(false);
    }
  };

  const handleFieldChange = (event) => {
    const { name, value, type, checked } = event.target;
    setValues((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const getHelperText = (field) => {
    if (touched[field] && errors[field]) {
      return errors[field];
    }
    if (field === 'contactPhoneNumber') {
      return 'Ejemplo: 8888-8888';
    }
    return ' ';
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Stack spacing={2.5}>
            <TextField
              label="Nombre"
              name="firstName"
              value={values.firstName}
              onChange={handleFieldChange}
              onBlur={() =>
                setTouched((prev) => ({ ...prev, firstName: true }))
              }
              error={Boolean(touched.firstName && errors.firstName)}
              helperText={getHelperText('firstName')}
              fullWidth
            />
            <TextField
              label="Apellidos"
              name="lastName"
              value={values.lastName}
              onChange={handleFieldChange}
              onBlur={() => setTouched((prev) => ({ ...prev, lastName: true }))}
              error={Boolean(touched.lastName && errors.lastName)}
              helperText={getHelperText('lastName')}
              fullWidth
            />
            <TextField
              label="Correo electrónico"
              type="email"
              name="email"
              value={values.email}
              onChange={handleFieldChange}
              onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
              error={Boolean(touched.email && errors.email)}
              helperText={getHelperText('email')}
              fullWidth
            />
            <TextField
              label="Teléfono"
              name="contactPhoneNumber"
              value={values.contactPhoneNumber}
              onChange={handleFieldChange}
              onBlur={() =>
                setTouched((prev) => ({ ...prev, contactPhoneNumber: true }))
              }
              error={Boolean(
                touched.contactPhoneNumber && errors.contactPhoneNumber
              )}
              helperText={getHelperText('contactPhoneNumber')}
              fullWidth
              inputProps={{ maxLength: 9 }}
            />
          </Stack>
        );
      case 1:
        return (
          <Stack spacing={2.5}>
            <TextField
              label="Provincia"
              name="provincia"
              value={values.provincia}
              onChange={handleFieldChange}
              onBlur={() =>
                setTouched((prev) => ({ ...prev, provincia: true }))
              }
              error={Boolean(touched.provincia && errors.provincia)}
              helperText={getHelperText('provincia')}
              fullWidth
            />
            <TextField
              label="Cantón"
              name="canton"
              value={values.canton}
              onChange={handleFieldChange}
              onBlur={() => setTouched((prev) => ({ ...prev, canton: true }))}
              error={Boolean(touched.canton && errors.canton)}
              helperText={getHelperText('canton')}
              fullWidth
            />
            <TextField
              label="Dirección exacta"
              name="direccion"
              value={values.direccion}
              onChange={handleFieldChange}
              onBlur={() =>
                setTouched((prev) => ({ ...prev, direccion: true }))
              }
              error={Boolean(touched.direccion && errors.direccion)}
              helperText={getHelperText('direccion')}
              fullWidth
              multiline
              minRows={3}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={values.rememberClient}
                  onChange={handleFieldChange}
                  name="rememberClient"
                  color="primary"
                />
              }
              label="Recordar mis datos para la próxima compra"
            />
          </Stack>
        );
      case 2:
        return (
          <Stack spacing={3}>
            <Box>
              <Typography variant="h5" gutterBottom>
                Vista previa de la orden
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Revisa que los datos sean correctos antes de confirmar.
              </Typography>
            </Box>
            <Box sx={{ overflowX: 'auto' }} ref={orderPreviewRef}>
              <PurchaseOrderContainer />
            </Box>
          </Stack>
        );
      default:
        return null;
    }
  };

  return (
    <Container component="section" maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
      <Box sx={{ p: { xs: 1, md: 4 }, bgcolor: 'background.paper' }}>
        <Stack spacing={4}>
          <Stack spacing={1}>
            <Typography variant="h4" component="h1">
              Check-out
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Completa los pasos para coordinar la entrega de tu pedido.
            </Typography>
          </Stack>

          <Stepper
            activeStep={activeStep}
            alternativeLabel
            sx={{
              '& .MuiStepLabel-label': {
                fontSize: { xs: '0.75rem', md: '0.9rem' },
              },
            }}
          >
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {status && (
            <Alert
              severity={status.type}
              onClose={() => setStatus(null)}
              sx={{ borderRadius: 2 }}
            >
              {status.message}
            </Alert>
          )}

          <Box component="form" noValidate>
            {renderStepContent()}
            <Box
              mt={4}
              display="flex"
              flexWrap="wrap"
              gap={2}
              justifyContent="space-between"
            >
              <Button
                variant="text"
                color="inherit"
                onClick={handleBack}
                disabled={activeStep === 0}
              >
                Volver
              </Button>
              {activeStep < steps.length - 1 ? (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  disabled={!isStepValid(activeStep)}
                >
                  Continuar
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleFinish}
                  disabled={!cart.items.length || isGeneratingOrder}
                >
                  {isGeneratingOrder ? 'Generando orden...' : 'Confirmar pedido'}
                </Button>
              )}
            </Box>
          </Box>
        </Stack>
      </Box>
      {showNotification && (
        <CartNotification
          onCloseInfoModal={() => setShowNotification(false)}
        />
      )}
    </Container>
  );
};

export default CheckoutFlow;
