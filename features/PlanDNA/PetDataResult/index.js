import React from 'react';
import Link from 'next/link';
import { Box, Button, IconButton, Typography } from '@mui/material';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';

import styles from './PetDataResult.module.scss';

import PetCard from '../PetCard';

const PetDataResult = ({ petData, addAnotherPet, onEdit, onDeletePet }) => {
  return (
    <div className={styles['pet-data-result']}>
      <Box mb={2}>
        <Typography mb={2} variant="h2" component="h2"><strong>¡Genial!</strong></Typography>
        <Typography mb={4} component="p">
          Verifica la información de {petData.length > 1 ? 'tus mascotas' : 'tu mascota'}.
          Si deseas actualizar algún dato, puedes editar la información. De lo contrario,
          continúa para obtener un plan de acuerdo a su Porción Diaria Recomendada (PDR).
        </Typography>
      </Box>
      {petData.map((pet, index) => (
        <Box mb={4} key={pet.id}>
          <PetCard colorIndex={index} petInfo={pet} editPet={onEdit} deletePet={onDeletePet} />
        </Box>
      ))}
      <IconButton
        aria-label="Agregar otra mascota"
        color="secondary"
        className={styles['pet-data-result_add']}
        onClick={addAnotherPet}
      >
        <AddCircleRoundedIcon fontSize="large" />
      </IconButton>
      <Button component={Link} href="/productos/" variant="contained">
        Ver productos
      </Button>
    </div>
  );
};

export default PetDataResult;
