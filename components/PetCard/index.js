import React from 'react';
import {
  Avatar,
  Box,
  Card,
  CardHeader,
  CardContent,
  Typography,
} from '@mui/material';
import { cyan, pink, purple, teal, blue, green, yellow } from '@mui/material/colors';
import OptionsMenu from '../OptionsMenu';
import petContentDictionary from './petContentDictionary';

const colors = [cyan[500], pink[500], purple[500], teal[500], blue[500], green[500], yellow[500]];

const PetDataDisplay = ({ petInfo }) => {
  const rows = [
    {
      key: 'Edad',
      value: petContentDictionary.age[petInfo.age],
    },
    {
      key: 'Etapa',
      value: petContentDictionary.puppyStage[petInfo.puppyStage],
    },
    {
      key: 'Tamaño',
      value: petContentDictionary.size[petInfo.size],
    },
    {
      key: 'Castración',
      value: petContentDictionary.castrated[petInfo.castrated],
    },
    {
      key: 'Contextura',
      value: petContentDictionary.bodyContexture[petInfo.bodyContexture],
    },
    {
      key: 'Actividad diaria',
      value: petContentDictionary.dailyActivity[petInfo.dailyActivity],
    },
    {
      key: 'Peso en kilogramos',
      value: `${petInfo.weight} kg`,
    },
  ];
  return (
    <>
      {rows.map((row) => (
        <Box key={row.key} display="flex" justifyContent="space-between">
          <Typography fontWeight={600} display="inline">
            {row.key}
          </Typography>{' '}
          <Typography display="inline">{row.value}</Typography>
        </Box>
      ))}
    </>
  );
};

const PetCard = ({ petInfo, editPet, deletePet, colorIndex }) => {
  const { id, name, portionSize } = petInfo;
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardHeader
        sx={{
          backgroundColor: colors[colorIndex],

          '& .MuiCardHeader-title': {
            fontWeight: 600,
            fontSize: 22,
            color: 'white',
          },
          '& .MuiCardHeader-subheader': {
            fontSize: 16,
            color: 'white',
          }
        }}
        avatar={
          <Avatar
            aria-label="Inicial de la mascota"
            sx={{
              bgcolor: 'white',
              color: colors[colorIndex],
              fontWeight: 600,
            }}
          >
            {name[0].toUpperCase()}
          </Avatar>
        }
        action={
          <OptionsMenu
            deleteItem={() => deletePet(id)}
            editItem={() => editPet(id)}
          />
        }
        title={name}
        subheader={`PDR: ${portionSize} gr`}
      />
      <CardContent>
        <PetDataDisplay petInfo={petInfo} />
      </CardContent>
    </Card>
  );
};

export default PetCard;
