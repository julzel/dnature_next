import React from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';

import styles from './PetDataResult.module.scss';

import PetCard from '../../../components/PetCard';

const PetDataResult = ({ petData, addAnotherPet, onEdit, onDeletePet }) => {
  console.log(petData)
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
        <Box mb={4} key={index}>
          <PetCard colorIndex={index} petInfo={pet} editPet={onEdit} deletePet={onDeletePet} />
        </Box>
      ))}
      <IconButton
        color="secondary"
        className={styles['pet-data-result_add']}
        onClick={addAnotherPet}
      >
        <AddCircleRoundedIcon fontSize="large" />
      </IconButton>
    </div>
  );
};

export default PetDataResult;
