import React, { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';

const BlogIntro = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleClick = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <Box mb={2}>
      <Typography component="p" mb={2} variant="body1" gutterBottom>
        ¡Bienvenidos! Este es un espacio dedicado a ofrecerte valiosa y
        confiable información sobre la alimentación natural y tenencia
        responsable de tus amados compañeros de cuatro patas.
      </Typography>
      {isExpanded && (
        <>
          <Typography component="p" mb={2} variant="body1" gutterBottom>
            Abordaremos no solo alimentación, sino también aspectos de cuidado
            responsable, para que puedas disfrutar plenamente de la experiencia de
            ser dueño de una mascota, sabiendo que estás brindando el mejor cuidado
            posible.
          </Typography>
          <Typography component="p" variant="body1" gutterBottom>
            Este blog es tu recurso para comprender mejor cómo nutrir y cuidar a tus
            mascotas de la manera más saludable y amorosa posible. Queremos que te
            sientas empoderado para proporcionarles una vida excepcional. Únete a
            nosotros en esta aventura de amor y cuidado por nuestros amigos peludos.
          </Typography>
        </>
      )}
      <Box display={'flex'} justifyContent={'right'}>
        <Button color="primary" onClick={handleClick} size='small'>
          {isExpanded ? 'Leer menos' : 'Leer más'}
        </Button>
      </Box>
    </Box>
  );
};

export default BlogIntro;
