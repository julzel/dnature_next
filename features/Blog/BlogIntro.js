import React, { useState } from 'react';
import {
  Box,
  Typography,
} from '@mui/material';

import styles from './Blog.module.scss';

const BlogIntro = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleClick = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <Box my={[4, 8]} className={styles['blog-intro']}>
      <Typography mb={[2, 4]} component="h2" variant="h2" gutterBottom>
        Este es un espacio dedicado a ofrecerte información valiosa y confiable
        sobre la alimentación natural y tenencia responsable de tus compañeros
        de cuatro patas
      </Typography>
      <Typography component="p" mb={2} variant="body1" gutterBottom>
        Aquí encontrarás una gama de artículos y guías que abordan una variedad
        de temas, desde la nutrición y la tenencia responsable, hasta consejos
        para crear entornos saludables y entender el comportamiento de tus
        mascotas. Nuestros contenidos están respaldados por expertos en
        nutrición animal y veterinarios, quienes nos ayudan a proporcionar
        información exclusiva, práctica y basada en investigaciones científicas,
        todo ello presentado de una manera fácil de entender.
      </Typography>
      <Typography component="p" mb={0} variant="body1" gutterBottom>
        Estamos emocionados de tener la oportunidad de ayudarte en este viaje.
        Así que siéntete libre de explorar, aprender y compartir los
        conocimientos que encuentres aquí con otros dueños de mascotas.
        ¡Empecemos este viaje hacia el bienestar natural de nuestras mascotas
        juntos!
      </Typography>
      {isExpanded && <></>}
    </Box>
  );
};

export default BlogIntro;
