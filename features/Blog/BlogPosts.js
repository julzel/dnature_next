import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Box, Card, ImageList, ImageListItem, Typography } from '@mui/material';
import postCategories from './post-categories';
import { useWindow } from '../../hooks';

import styles from './Blog.module.scss';

const BlogPostItem = ({ post }) => (
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
    <Box
      p={1}
      bgcolor={postCategories[post.category].color}
    >
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
);

const BlogPosts = ({ posts }) => {
  const isMobile = useWindow();

  return (
    <Box sx={{ maxWidth: '900px', margin: '0 auto' }}>
      <ImageList gap={16} cols={isMobile ? 1 : 3}>
        {posts.map((post, index) => (
          <ImageListItem
            key={index}
          >
            <Link href={`/blog/${post.sys.id}`} passHref>
              <a className={styles['blog-posts_link']}>
                <BlogPostItem post={post} />
              </a>
            </Link>
          </ImageListItem>
        ))}
      </ImageList>
    </Box>
  );
};

export default BlogPosts;
