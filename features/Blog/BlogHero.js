import React from 'react';
import { Box, Typography } from '@mui/material';

// local imports

// styles
import styles from './Blog.module.scss';

const BlogHero = ({ onScrollDown }) => {
  return (
    <Box
      display={'flex'}
      justifyContent={'center'}
      p={8}
      pb={16}
      className={styles['blog-hero']}
    >
      <Typography
        variant="h3"
        component="h1"
        gutterBottom
        className={styles['blog-hero_title']}
      >
        Nutrición con <span>amor</span>: Guía para mascotas <span>felices</span>
      </Typography>
    </Box>
  );
};

export default BlogHero;
