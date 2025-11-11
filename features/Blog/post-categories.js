import { Heartbeat, Bone, Signpost, Paw, Users, HelpCircle } from 'lucide-react';
import {
  lightBlue,
  lime,
  pink,
  teal,
  cyan,
  purple,
} from '@mui/material/colors';

const postCategories = {
  salud: {
    color: lightBlue[800],
    icon: <Heartbeat size={24} color='white' />,
  },
  nutrición: { color: pink[800], icon: <Bone size={24} color='white' /> },
  entorno: { color: lime[800], icon: <Signpost size={24} color='white' /> },
  comportamiento: { color: teal[800], icon: <Paw size={24} color='white' /> },
  tenencia: { color: cyan[800], icon: <Users size={24} color='white' /> },
  otro: {
    color: purple[800],
    icon: <HelpCircle size={24} />,
  },
};

export default postCategories;
