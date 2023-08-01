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
  salud: {
    color: lightBlue[800],
    icon: <FontAwesomeIcon size='xl' icon={faHeartbeat} color='white' />,
  },
  nutrición: { color: pink[800], icon: <FontAwesomeIcon size='xl' icon={faBone} color='white' /> },
  entorno: { color: lime[800], icon: <FontAwesomeIcon size='xl' icon={faSignsPost} color='white' /> },
  comportamiento: { color: teal[800], icon: <FontAwesomeIcon size='xl' icon={faPaw} color='white' /> },
  tenencia: { color: cyan[800], icon: <FontAwesomeIcon size='xl' icon={faPeopleRoof} color='white' /> },
  otro: {
    color: purple[800],
    icon: <FontAwesomeIcon size='xl' icon={faCircleQuestion} />,
  },
};

export default postCategories;
