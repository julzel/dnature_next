import React from 'react';
import { Typography } from '@mui/material';

// local imports
import styles from './CursiveTitle.module.scss';

const CursiveTitle = ({ children }) => (
  <Typography className={styles['cursive-title']} mb={[2, 8]} component="h2" variant="h3" gutterBottom>
    {children}
  </Typography>
);

export default CursiveTitle;
