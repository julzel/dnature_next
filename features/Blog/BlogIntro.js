import React, { useState } from 'react';
import {
  Card,
  CardActions,
  Box,
  Typography,
  Button,
  CardContent,
} from '@mui/material';

import styles from './Blog.module.scss';

const BlogIntro = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleClick = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <Card sx={{ marginBottom: '32px'}} className={styles['blog-intro']}>
      <CardContent>
        <Box p={2} pb={0}>
          <Typography component="p" mb={2} variant="body1" gutterBottom>
            ¡Bienvenidos! Este es un espacio dedicado a ofrecerte valiosa y
            confiable información sobre la alimentación natural y tenencia
            responsable de tus amados compañeros de cuatro patas.
          </Typography>
          {isExpanded && (
            <>
              <Typography component="p" mb={2} variant="body1" gutterBottom>
                Abordaremos también aspectos de cuidado responsable, para que
                puedas disfrutar plenamente de la experiencia de ser dueño de
                una mascota, sabiendo que estás brindando el mejor cuidado
                posible.
              </Typography>
              <Typography component="p" mb={0} variant="body1" gutterBottom>
                Este blog es tu recurso para comprender mejor cómo nutrir y
                cuidar a tus mascotas de la manera más saludable y amorosa
                posible. Queremos que te sientas empoderado para proporcionarles
                una vida excepcional. Únete a nosotros en esta aventura de amor
                y cuidado por nuestros amigos peludos.
              </Typography>
            </>
          )}
        </Box>
      </CardContent>
      <CardActions>
        <Box width="100%" display={'flex'} justifyContent={'flex-end'}>
          <Button color="primary" onClick={handleClick} size="small">
            {isExpanded ? 'Leer menos' : 'Leer más'}
          </Button>
        </Box>
      </CardActions>
    </Card>
  );
};

export default BlogIntro;
