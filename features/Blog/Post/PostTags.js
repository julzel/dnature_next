import Link from 'next/link';
import { Box, Chip, Typography } from '@mui/material';

const PostTags = ({ tags }) => {
  return (
     <Box my={2}>
        <Typography variant="h6" component="h6" gutterBottom>
          Etiquetas
        </Typography>
        {tags.map((hashtag) => (
          <Link key={hashtag} href={`/blog/etiquetas/${hashtag}`} passHref>
            <Chip
              component={'a'}
              label={hashtag.toUpperCase()}
              sx={{ mr: 1, fontSize: '10px' }}
            />
          </Link>
        ))}
      </Box>
  );
}
 
export default PostTags;