import { Box, Button, Typography } from '@mui/material';
import React from 'react';

import styles from './Intro.module.scss';

const Intro = ({ start }) => {
  return (
    <Box className={styles.intro}>
      <div className={styles.intro_content}>
        <Typography mb={2} component="h1" variant="h1">
          ¡Hola!
        </Typography>
        <Typography paragraph>
          A continuación te haremos algunas preguntas para conocer mejor a tu
          mascota y poder recomendarte el mejor plan para ella.
        </Typography>
      </div>
      
      <Box
        display="flex"
        justifyContent="center"
        className={styles.intro_actions}
      >
        <Button disableElevation variant="contained" onClick={start}>
          Comencemos
        </Button>
      </Box>
    </Box>
  );
};

export default Intro;
