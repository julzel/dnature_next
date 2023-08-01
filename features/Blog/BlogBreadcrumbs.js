import Link from 'next/link';
import { Breadcrumbs, Link as MuiLink, Typography } from '@mui/material';

const BlogBreadcrumbs = ({ currentCrumb }) => {
  return (
    <Breadcrumbs aria-label="breadcrumb" mb={[2, 4]}>
      <MuiLink component={Link} href="/blog" underline="hover">
        Blog
      </MuiLink>
      <Typography color="text.primary">{currentCrumb || ''}</Typography>
    </Breadcrumbs>
  );
};

export default BlogBreadcrumbs;
