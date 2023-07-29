import {
  lightBlue,
  lime,
  pink,
  teal,
  yellow,
  purple,
} from '@mui/material/colors';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import LandscapeIcon from '@mui/icons-material/Landscape';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import PetsIcon from '@mui/icons-material/Pets';
import HouseIcon from '@mui/icons-material/House';
import HelpIcon from '@mui/icons-material/Help';

const postCategories = {
  Salud: { color: lightBlue[800], icon: <LocalHospitalIcon /> },
  Nutrición: { color: pink[800], icon: <RestaurantIcon /> },
  Entorno: { color: lime[800], icon: <LandscapeIcon /> },
  Comportamiento: { color: teal[800], icon: <PetsIcon /> },
  Tenencia: { color: yellow[800], icon: <HouseIcon /> },
  Otro: { color: purple[800], icon: <HelpIcon /> },
};

export default postCategories;
