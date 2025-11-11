import { Box, Card, Typography } from '@mui/material';
import Image from 'next/image';

// local imports

import { formatToLocaleDate } from '../../util/dates';
import postCategories from './post-categories';

const BlogPostItem = ({ post }) => (
  <Card elevation={1} sx={{ mb: 1 }}>
    <Box position={'relative'}>
      <Image
        src={post.media.url}
        alt={post.title}
        width={300}
        height={250}
        style={{ objectFit: 'cover', width: '100%', height: 'auto' }}
      />
    </Box>
    <Box p={1} bgcolor={postCategories[post.category].color}>
      <Typography color="white" variant="h6" gutterBottom>
        {post.title}
      </Typography>
      <Typography
        textAlign="right"
        color="white"
        variant="subtitle2"
        gutterBottom
      >
        {formatToLocaleDate(post.sys.publishedAt)}
      </Typography>
    </Box>
    <Box height="100%" flex={1} p={1}>
      <Typography color variant="body2">
        {post.excerpt}
      </Typography>
    </Box>
  </Card>
);

export default BlogPostItem;
