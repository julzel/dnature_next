import Image from 'next/image';
import Carousel from 'react-material-ui-carousel';
import { Box, Card } from '@mui/material';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';

// local imports
import styles from './Post.module.scss';

const PostBody = ({ body, images }) => {
  return (
    <Box
      className={styles.post_body}
      sx={{
        paddingRight: {
          xs: 0,
          md: 4,
        },
      }}
    >
      {documentToReactComponents(body.json)}
      <Box my={4}>
        <Carousel
          animation="slide"
          autoPlay={false}
          indicators={true}
          // index={currentStep}
        >
          {images.map((img, i) => (
            <Card key={`img-${i}`}>
              <Image
                src={img.url}
                alt={'tbd'}
                layout="responsive"
                objectFit="cover"
                width={300}
                height={250}
              />
            </Card>
          ))}
        </Carousel>
      </Box>
    </Box>
  );
};

export default PostBody;
