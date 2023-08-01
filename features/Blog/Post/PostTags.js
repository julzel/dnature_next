import Link from 'next/link';
import { Box, Card, CardHeader, Chip, Typography } from '@mui/material';

const PostTags = ({ tags }) => {
  return (
    <Card sx={{ my: 2, bgcolor: 'primary.light' }} elevation={1}>
      <CardHeader
        title={
          <Box display={'flex'} flexWrap={'wrap'}>
            <Typography variant="h5" color={'textSecondary'} mr={2}>
              Etiquetas:
            </Typography>
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
                    bgcolor: 'white',
                    mr: 1,
                    mb: { xs: 2, md: 1 },
                    fontSize: '12px',
                  }}
                />
              </Link>
            ))}
          </Box>
        }
      />
    </Card>
  );
};

export default PostTags;
