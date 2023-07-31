import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  lightBlue,
  lime,
  pink,
  teal,
  cyan,
  purple,
} from '@mui/material/colors';
import {
  faBone,
  faHeartbeat,
  faSignsPost,
  faPaw,
  faPeopleRoof,
  faCircleQuestion,
} from '@fortawesome/free-solid-svg-icons';

const postCategories = {
  Salud: {
    color: lightBlue[800],
    icon: <FontAwesomeIcon size='xl' icon={faHeartbeat} />,
  },
  Nutrición: { color: pink[800], icon: <FontAwesomeIcon size='xl' icon={faBone} /> },
  Entorno: { color: lime[800], icon: <FontAwesomeIcon size='xl' icon={faSignsPost} /> },
  Comportamiento: { color: teal[800], icon: <FontAwesomeIcon size='xl' icon={faPaw} /> },
  Tenencia: { color: cyan[800], icon: <FontAwesomeIcon size='xl' icon={faPeopleRoof} /> },
  Otro: {
    color: purple[800],
    icon: <FontAwesomeIcon size='xl' icon={faCircleQuestion} />,
  },
};

export default postCategories;
