import { Card, CardContent } from '@mui/material';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { grey } from '@mui/material/colors';

// local imports
import styles from './Post.module.scss';

const PostAside = ({ content }) => {
  return (
    <Card variant="outlined">
      <CardContent sx={{ bgcolor: grey[50]}} className={styles.post_aside}>
        {documentToReactComponents(content.json)}
      </CardContent>
    </Card>
  );
};

export default PostAside;
