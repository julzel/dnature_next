'use client';

import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import {
  Alert,
  Box,
  Button,
  Container,
  Stack,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from '@mui/material';

import { useCartContext } from '../../contexts/shopping-cart-context';
import CartNotification from '../../features/Cart/CartNotification';
import {
  storage,
  captureElementScreenshot,
  downloadScreenShot,
} from '../../util';
import ClientInfoStep from './ClientInfoStep';
import DeliveryInfoStep from './DeliveryInfoStep';
import SummaryStep from './SummaryStep';

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

  const isStepValid = useCallback(
    (stepIndex) => {
    const stepFields = STEP_FIELDS[stepIndex];
    if (!stepFields.length) {
      return true;
    }
    return stepFields.every((field) => !errors[field]);
  },
    [errors]
  );

  const markStepAsTouched = useCallback((stepIndex) => {
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
  }, []);

  const persistClient = useCallback(() => {
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
  }, [values]);

  const handleStatusDismiss = useCallback(() => {
    setStatus(null);
  }, []);

  const handleNotificationClose = useCallback(() => {
    setShowNotification(false);
  }, []);

  const handleNext = useCallback(() => {
    handleStatusDismiss();
    if (!isStepValid(activeStep)) {
      markStepAsTouched(activeStep);
      return;
    }

    if (activeStep === 1) {
      persistClient();
    }

    setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
  }, [
    activeStep,
    handleStatusDismiss,
    isStepValid,
    markStepAsTouched,
    persistClient,
  ]);

  const handleBack = useCallback(() => {
    handleStatusDismiss();
    setActiveStep((prev) => Math.max(prev - 1, 0));
  }, [handleStatusDismiss]);

  const handleFinish = useCallback(async () => {
    if (!cart.items.length) {
      setStatus({
        type: 'error',
        message: 'Tu carrito está vacío. Agrega productos para continuar.',
      });
      return;
    }

    handleStatusDismiss();
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
  }, [
    cart.items.length,
    handleStatusDismiss,
    persistClient,
    storeCartInLocalStorage,
  ]);

  const handleFieldChange = useCallback((event) => {
    const { name, value, type, checked } = event.target;
    setValues((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }, []);

  const handleFieldBlur = useCallback((event) => {
    const { name } = event.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  }, []);

  const getHelperText = useCallback(
    (field) => {
    if (touched[field] && errors[field]) {
      return errors[field];
    }
    if (field === 'contactPhoneNumber') {
      return 'Ejemplo: 8888-8888';
    }
    return ' ';
    },
    [errors, touched]
  );

  const stepContent = useMemo(() => {
    if (activeStep === 0) {
      return (
        <ClientInfoStep
          values={values}
          errors={errors}
          touched={touched}
          getHelperText={getHelperText}
          onChange={handleFieldChange}
          onBlur={handleFieldBlur}
        />
      );
    }

    if (activeStep === 1) {
      return (
        <DeliveryInfoStep
          values={values}
          errors={errors}
          touched={touched}
          getHelperText={getHelperText}
          onChange={handleFieldChange}
          onBlur={handleFieldBlur}
        />
      );
    }

    return <SummaryStep orderPreviewRef={orderPreviewRef} />;
  }, [
    activeStep,
    errors,
    getHelperText,
    handleFieldBlur,
    handleFieldChange,
    orderPreviewRef,
    touched,
    values,
  ]);

  return (
    <Container component="section" maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
      <Box sx={{ p: { xs: 1, md: 4 }, bgcolor: 'background.paper' }}>
        <Stack spacing={4}>
          <Stack spacing={1}>
            <Typography variant="h4" component="h1">
              Check out
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
              onClose={handleStatusDismiss}
              sx={{ borderRadius: 2 }}
            >
              {status.message}
            </Alert>
          )}

          <Box component="form" noValidate>
            {stepContent}
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
        <CartNotification onCloseInfoModal={handleNotificationClose} />
      )}
    </Container>
  );
};

export default CheckoutFlow;
