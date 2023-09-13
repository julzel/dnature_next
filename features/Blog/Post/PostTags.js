import Link from 'next/link';
import { Box, Card, CardContent, Chip, Typography } from '@mui/material';
import { lime } from '@mui/material/colors';

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
        <Link
          href={`/blog/busqueda/?field=category&value=${category}`}
          passHref
        >
          <Chip
            label={category.toUpperCase()}
            sx={{
              fontSize: '10px',
              background: postCategories[category].color,
              color: 'white',
              pl: 1,
            }}
            icon={postCategories[category].icon}
          />
        </Link>
      </CardContent>
      <Box px={2} pt={2}>
        <Typography variant="subtitle1" color={'textSecondary'}>
          Etiquetas:
        </Typography>
      </Box>
      <CardContent p={0}>
        {tags.map((hashtag) => (
          <Link
            key={hashtag}
            href={`/blog/busqueda/?field=hashtags_contains_some&value=${hashtag}`}
            passHref
          >
            <Chip
              component={'a'}
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
          </Link>
        ))}
      </CardContent>
    </Card>
  );
};

export default PostTags;
