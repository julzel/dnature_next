import React from 'react';
import {
  Card,
  CardContent,
  Avatar,
  Typography,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { makeStyles } from '@mui/styles';

const petDataDictionary = {
  age: {
    adult: 'Adulto',
    puppy: 'Cachorro',
  },
  puppyStage: {
    stage1: 'Etapa 1 - menor a 7 meses',
    stage2: 'Etapa 2 - 7 meses a 1 año',
    stage3: 'Etapa 3 - 1 año hasta etapa adulta',
  },
  size: {
    small: 'Mini - menos de 4kg',
    medium: 'Pequeño/Mediano - 5kg a 25kg',
    large: 'Grande/Gigante - más de 25kg',
  },
  castrated: {
    true: 'Castrado',
    false: 'Sin castrar',
  },
  bodyContexture: {
    underWeight: 'Bajo peso',
    ideal: 'Ideal',
    overWeight: 'Sobrepeso',
  },
  dailyActivity: {
    sedentary: 'Sedentario',
    active: 'Activo',
    veryActive: 'Deportista',
  },
};

const useStyles = makeStyles({
  card: {
    display: 'flex',
  },
  avatar: {
    backgroundColor: '#f50057',
    margin: 10,
    width: 60,
    height: 60,
    fontSize: 24,
  },
  content: {
    flex: '1 0 auto',
  },
});

const PetCard = ({ petInfo }) => {
  const classes = useStyles();
  const {
    name,
    age,
    puppyStage,
    size,
    castrated,
    bodyContexture,
    dailyActivity,
    weight,
  } = petInfo;

  return (
    <Card className={classes.card}>
      <CardContent className={classes.content}>
        <Avatar className={classes.avatar}>
          {name.charAt(0).toUpperCase()}
        </Avatar>
        <Typography component="h5" variant="h5">
          {name}
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          Edad: {petDataDictionary.age[age]}
        </Typography>
      </CardContent>

      <CardContent className={classes.content}>
        <List>
          <ListItem>
            <ListItemText
              primary={`Puppy stage: ${petDataDictionary.puppyStage[puppyStage]}`}
            />
          </ListItem>
          <ListItem>
            <ListItemText primary={`Size: ${petDataDictionary.size[size]}`} />
          </ListItem>
          <ListItem>
            <ListItemText primary={`Castración: ${castrated ? 'Sí' : 'No'}`} />
          </ListItem>
          <ListItem>
            <ListItemText
              primary={`Contextura: ${petDataDictionary.bodyContexture[bodyContexture]}`}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary={`Actividad diaria: ${petDataDictionary.dailyActivity[dailyActivity]}`}
            />
          </ListItem>
          <ListItem>
            <ListItemText primary={`Peso: ${weight}`} />
          </ListItem>
        </List>
      </CardContent>
    </Card>
  );
};

export default PetCard;
