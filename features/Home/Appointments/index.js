import React from 'react';
import Image from 'next/image';
import {
  Button,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Typography,
  Box,
  CardActions,
} from '@mui/material';

// // local imports
import nutri1 from '../../../public/images/nutri/nutri_1.jpeg';
import nutri2 from '../../../public/images/nutri/nutri_2.jpeg';
import logoBlack from '../../../public/images/dnature-logo.svg';
import styles from './Appointments.module.scss';
import CursiveTitle from '../../../components/CursiveTitle';

// Componente ServiceCard para mostrar información sobre cada tipo de consulta
const ServiceCard = ({ title, description, price, image }) => (
  <Card>
    <CardMedia>
      <Box
      sx={{
        overflow: 'hidden',
        height: {
          xs: '250px', // extra-small devices - screen width: 0px or larger
          sm: '300px', // small devices - screen width: 600px or larger
          md: '350px', // medium devices - screen width: 900px or larger
          // add more breakpoints as needed
        },
      }}>
        <Image
          src={image}
          alt="DNAture Logo"
        />
      </Box>
    </CardMedia>

    <CardContent>
      <Typography variant="h6" component="div" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {description}
      </Typography>
      <Typography variant="h5" component="div" sx={{ marginTop: '10px' }}>
        {price}
      </Typography>
      <CardActions sx={{ justifyContent: 'flex-end' }}>
        <Button color="primary" size="small">
          Leer más
        </Button>
      </CardActions>
    </CardContent>
  </Card>
);

// Componente principal NutritionSection
const NutritionSection = () => {
  return (
    <Box className={styles['appointments-container']}>
      <Box className={styles['appointments']}>
        <CursiveTitle>Consulta Nutricional</CursiveTitle>

        <Typography
          variant="body1"
          color="text"
          sx={{
            marginTop: '2rem',
            marginBottom: '2rem',
            textAlign: 'center',
          }}
        >
          La salud de tu mascota comienza con su nutrición. Ofrecemos consultas
          personalizadas que se centran en sus necesidades únicas, asegurando su
          bienestar a través de la alimentación. Descubre nuestros planes:
        </Typography>

        <Grid container spacing={8} justifyContent="center">
          <Grid item xs={12} sm={6}>
            <ServiceCard
              title="Bases de la Nutrición Saludable"
              description="Ideal para propietarios que buscan entender y mejorar la dieta diaria de sus mascotas. Incluye evaluación inicial y recomendaciones personalizadas."
              price="Costo $60"
              image={nutri1}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <ServiceCard
              title="Plan para Necesidades Específicas"
              description="Diseñado para mascotas con condiciones particulares, este plan incluye una estrategia de alimentación detallada, seguimiento y ajustes sin costo adicional."
              price="Costo $90"
              image={nutri2}
            />
          </Grid>
        </Grid>
        <Box
          mt={6}
          sx={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Button variant="outlined" color="primary" size="large">
            Agenda tu Consulta Hoy
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default NutritionSection;
