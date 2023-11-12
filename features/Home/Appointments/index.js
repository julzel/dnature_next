import React from 'react';
import { Button, Typography, Box, Divider } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShieldDog } from '@fortawesome/free-solid-svg-icons';
import styles from './Appointments.module.scss';
import CursiveTitle from '../../../components/CursiveTitle';

// Constants for styles
const MARGIN_TOP = '2rem';
const MARGIN_BOTTOM = '2rem';
const TEXT_ALIGN_CENTER = 'center';

// AppointmentTypeBox Subcomponent
const AppointmentTypeBox = ({ title, description, price }) => (
  <Box className={styles['appointments_type']} p={2} m={1}>
    <Box className={styles['appointments_type-title']}>
      <FontAwesomeIcon icon={faShieldDog} size="lg" />
      <Typography
        variant="h6"
        component="h6"
        gutterBottom
        align={TEXT_ALIGN_CENTER}
        textTransform="uppercase"
        mb={2}
      >
        {title}
      </Typography>
    </Box>
    <Divider />
    <Box>
      <Typography variant="body2" mt={2}>
        {description}
      </Typography>
      <Typography
        variant="h4"
        component="h4"
        align="right"
        sx={{ marginTop: '20px' }}
      >
        {price}
      </Typography>
    </Box>
  </Box>
);

// NutritionSection Component
const NutritionSection = () => {
  return (
    <Box className={styles['appointments-container']}>
      <Box className={styles['appointments']}>
        <CursiveTitle>Consulta Nutricional</CursiveTitle>

        <Typography
          variant="body1"
          color="text"
          sx={{
            marginTop: MARGIN_TOP,
            marginBottom: MARGIN_BOTTOM,
            textAlign: TEXT_ALIGN_CENTER,
          }}
        >
          La salud de tu mascota comienza con su nutrición. Ofrecemos consultas
          personalizadas que se centran en sus necesidades únicas, asegurando su
          bienestar a través de la alimentación. Descubre nuestros planes:
        </Typography>

        <Box className={styles['appointments_types']}>
          <AppointmentTypeBox
            title="Plan para necesidades integrales"
            description="Ideal para propietarios que buscan entender y mejorar la dieta
            diaria de sus mascotas. Incluye evaluación inicial y
            recomendaciones personalizadas."
            price="$60"
          />
          <AppointmentTypeBox
            title="Plan para necesidades específicas"
            description="Diseñado para mascotas con condiciones particulares, este plan
            incluye una estrategia de alimentación detallada, seguimiento y
            ajustes sin costo adicional."
            price="$90"
          />
        </Box>

        <Box mt={6} sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button variant="outlined" color="primary" size="large">
            Agenda tu Consulta Hoy
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default NutritionSection;
