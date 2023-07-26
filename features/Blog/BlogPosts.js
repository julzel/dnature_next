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
  pink[700],
  purple[700],
  blue[700],
  teal[700],
  green[700],
  red[700],
  orange[700],
];

const BlogPosts = ({ posts }) => {
  const isMobile = useWindow();

  return (
    <Box sx={{ maxWidth: '900px', margin: '0 auto' }}>
      <ImageList gap={16} cols={isMobile ? 1 : 3}>
        {posts.map((post, index) => (
          <ImageListItem
            key={index}
            sx={{ marginBottom: isMobile ? '32px' : 'inherit ' }}
          >
            <Link href={`/blog/${post.sys.id}`} passHref>
              <a className={styles['blog-posts_link']}>
                <Card variant="outlined">
                  <Box position={'relative'}>
                    <Image
                      src={post.media.url}
                      alt={post.title}
                      layout="responsive"
                      objectFit="cover"
                      width={300}
                      height={250}
                    />
                  </Box>
                  <Box p={1} bgcolor={colors[index % colors.length]}>
                    <Typography color="white" variant="h6" gutterBottom>
                      {post.title}
                    </Typography>
                  </Box>
                  <Box height="100%" flex={1} p={1}>
                    <Typography color variant="body2">
                      {post.excerpt}
                    </Typography>
                  </Box>
                </Card>
              </a>
            </Link>
          </ImageListItem>
        ))}
      </ImageList>
    </Box>
  );
};

export default BlogPosts;
