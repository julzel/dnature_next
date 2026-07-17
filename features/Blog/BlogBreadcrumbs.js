'use client';

import { Breadcrumbs, Link as MuiLink, Typography } from '@mui/material';
import ClientLink from '../../components/ClientLink';

const BlogBreadcrumbs = ({ currentCrumb }) => {
  return (
    <Breadcrumbs aria-label="breadcrumb" mb={[2, 4]}>
      <MuiLink component={ClientLink} href="/blog" underline="hover">
        Blog
      </MuiLink>
      <Typography color="text.primary">{currentCrumb || ''}</Typography>
    </Breadcrumbs>
  );
};

export default BlogBreadcrumbs;
