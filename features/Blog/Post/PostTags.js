'use client';

import { Box, Card, CardContent, Chip, Typography } from '@mui/material';
import ClientLink from '../../../components/ClientLink';

// local imports
import postCategories from '../post-categories';

const PostTags = ({ category, tags }) => {
  return (
    <Card sx={{ mb: 2 }} variant="outlined">
      <Box px={2} pt={2}>
        <Typography variant="subtitle1" color={'textSecondary'}>
          Categoría:
        </Typography>
      </Box>
      <CardContent p={0}>
        <Chip
          component={ClientLink}
          href={`/blog/busqueda/?field=category&value=${category}`}
          label={category.toUpperCase()}
          sx={{
            fontSize: '10px',
            background: postCategories[category].color,
            color: 'white',
            pl: 1,
          }}
          icon={postCategories[category].icon}
        />
      </CardContent>
      <Box px={2} pt={2}>
        <Typography variant="subtitle1" color={'textSecondary'}>
          Etiquetas:
        </Typography>
      </Box>
      <CardContent p={0}>
        {tags.map((hashtag) => (
          <Chip
            key={hashtag}
            component={ClientLink}
            href={`/blog/busqueda/?field=hashtags_contains_some&value=${hashtag}`}
            label={hashtag.toUpperCase()}
            sx={{
              color: 'white !important',
              bgcolor: 'primary.main',
              mr: 1,
              mb: { xs: 2, md: 1 },
              fontSize: '12px',
              '&:hover': {
                bgcolor: 'primary.dark',
              },
              '&:active': {
                bgcolor: 'primary.dark',
              },
            }}
          />
        ))}
      </CardContent>
    </Card>
  );
};

export default PostTags;
