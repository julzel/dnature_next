import Image from 'next/image';
import Link from 'next/link';
import {
  Avatar,
  Box,
  Card,
  CardMedia,
  Chip,
  Grid,
  Typography,
} from '@mui/material';

// local imports
import { formatContentfulDate } from '../../../util/dates';
import postCategories from '../post-categories.js';
import BlogBreadcrumbs from '../BlogBreadcrumbs';

const PostHeader = ({ title, media, date, author, category }) => {
  const localDateString = formatContentfulDate(date);

  return (
    <Box mb={4}>
      <BlogBreadcrumbs currentCrumb={'Resultados'} />
      <Typography variant="h3" component="h1" gutterBottom mb={2}>
        {title}
      </Typography>

      <Grid container alignItems={'center'} mb={[2, 4]}>
        <Grid item xs={9}>
          {author && (
            <Grid container alignItems={'center'}>
              <Grid item>
                <Avatar src={author.avatar.url} alt={author.name} />
              </Grid>
              <Grid item ml={1}>
                <Typography variant="subtitle2" component="h2" gutterBottom>
                  Por: {author.name}
                </Typography>
              </Grid>
            </Grid>
          )}
        </Grid>
        <Grid item xs={3}>
          <Typography
            color="textSecondary"
            variant="subtitle2"
            component="h2"
            gutterBottom
            align="right"
          >
            {localDateString}
          </Typography>
        </Grid>
      </Grid>
      {media && (
        <Card elevation={0}>
          <CardMedia>
            <Image
              src={media.url}
              alt={title}
              layout="responsive"
              objectFit="cover"
              width={300}
              height={250}
            />
          </CardMedia>
        </Card>
      )}
      <Box mt={[2, 4]}>
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
      </Box>
    </Box>
  );
};

export default PostHeader;
