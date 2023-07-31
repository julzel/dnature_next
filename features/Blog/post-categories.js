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
    icon: <FontAwesomeIcon size='xl' icon={faHeartbeat} />,
  },
  nutrición: { color: pink[800], icon: <FontAwesomeIcon size='xl' icon={faBone} /> },
  entorno: { color: lime[800], icon: <FontAwesomeIcon size='xl' icon={faSignsPost} /> },
  comportamiento: { color: teal[800], icon: <FontAwesomeIcon size='xl' icon={faPaw} /> },
  tenencia: { color: cyan[800], icon: <FontAwesomeIcon size='xl' icon={faPeopleRoof} /> },
  otro: {
    color: purple[800],
    icon: <FontAwesomeIcon size='xl' icon={faCircleQuestion} />,
  },
};

export default postCategories;
