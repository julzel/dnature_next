import Image from 'next/image';
import {
  Avatar,
  Box,
  Card,
  CardMedia,
  Grid,
  Typography,
} from '@mui/material';

// local imports
import { formatToLocaleDate } from '../../../util/dates';
import BlogBreadcrumbs from '../BlogBreadcrumbs';

const PostHeader = ({ title, media, date, author }) => {
  const localDateString = formatToLocaleDate(date);

  return (
    <Box mb={4}>
      <BlogBreadcrumbs currentCrumb="Post" />
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
    </Box>
  );
};

export default PostHeader;
