import { Card, CardContent } from '@mui/material';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { red } from '@mui/material/colors';

// local imports
import styles from './Post.module.scss';

const PostAside = ({ content }) => {
  return (
    <Card
      variant="outlined"
      sx={{ bgcolor: red[50] }}
    >
      <CardContent className={styles.post_aside} sx={{padding: { sm: 1, md: 3 }}}>
        {documentToReactComponents(content.json)}
      </CardContent>
    </Card>
  );
};

export default PostAside;
