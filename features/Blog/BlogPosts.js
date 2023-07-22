import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Box, Card, ImageList, ImageListItem, Typography } from '@mui/material';
import {
  red,
  pink,
  purple,
  indigo,
  blue,
  green,
  yellow,
  orange,
  teal,
} from '@mui/material/colors';
import { useWindow } from '../../hooks';

import styles from './Blog.module.scss';

const colors = [
  pink[500],
  teal[500],
  purple[500],
  blue[500],
  green[500],
  red[500],
  orange[500],
];

const BlogPosts = ({ posts }) => {
  const isMobile = useWindow();

  return (
    <Box sx={{ maxWidth: '900px', margin: '0 auto' }}>
      <ImageList variant='masonry' gap={16} cols={isMobile ? 1 : 3}>
        {posts.map((post, index) => (
          <ImageListItem
            key={index}
            sx={{ marginBottom: isMobile ? '32px' : 'inherit ' }}
          >
            <Card>
              <Box position={'relative'}>
                {post.mediaCollection.items.length > 0 && (
                  <Image
                    src={post.mediaCollection.items[0].url}
                    alt={post.title}
                    layout="responsive"
                    objectFit="cover"
                    width={300} // replace with actual width
                    height={300} // replace with actual height
                  />
                )}
              </Box>
              <Link href={`/blog/${post.sys.id}`} passHref>
                <a>
                  <Box height="100%" flex={1} bgcolor={colors[index % colors.length]} p={1}>
                    <Typography color="white" variant="h5" gutterBottom>
                      {post.title}
                    </Typography>
                    <Typography color="white" variant="body2">
                      {post.excerpt}
                    </Typography>
                  </Box>
                </a>
              </Link>
            </Card>
          </ImageListItem>
        ))}
      </ImageList>
      {/* <Grid container spacing={2} className={styles['blog-posts']}>
        {posts.map((post, index) => (
          <Grid item key={index} xs={12} sm={6} md={4}>
            <Link href={`/blog/${post.sys.id}`} passHref>
              <a>
                <Card className={styles['blog-card']}>
                  {post.mediaCollection.items.length > 0 && (
                    <CardMedia
                      className={styles['blog-media']}
                      image={post.mediaCollection.items[0].url}
                      title={post.title}
                    />
                  )}
                  <CardContent>
                    <Typography variant="h5" component="div" gutterBottom>
                      {post.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {post.excerpt}
                    </Typography>
                  </CardContent>
                </Card>
              </a>
            </Link>
          </Grid>
        ))}
      </Grid> */}
    </Box>
  );
};

export default BlogPosts;
