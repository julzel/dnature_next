import Link from 'next/link';
import { Card, CardContent, CardHeader, Chip, Typography } from '@mui/material';

const PostTags = ({ tags }) => {
  return (
    <Card sx={{ my: 2 }} elevation={1}>
      <CardHeader title="Etiquetas" />
      <CardContent>
        {tags.map((hashtag) => (
          <Link key={hashtag} href={`/blog/etiquetas/${hashtag}`} passHref>
            <Chip
              component={'a'}
              label={hashtag.toUpperCase()}
              sx={{ mr: 1, mb: 1, fontSize: '10px' }}
            />
          </Link>
        ))}
      </CardContent>
    </Card>
  );
};

export default PostTags;
