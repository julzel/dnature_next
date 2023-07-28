import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Box, Grid, Typography, Divider } from '@mui/material';
import { blue } from '@mui/material/colors';

const ProductItem = ({ product }) => (
  <Grid
    item
    key={product.sys.id}
    xs={12}
    sx={{ borderLeft: `1px solid ${blue[500]}`, pb: 2 }}
  >
    <Link
      passHref
      href={{
        pathname: `/productos/${product.urlSlug}`,
        query: { id: product.sys.id },
      }}
    >
      <Grid container alignItems="center">
        {/* Thumbnail */}
        <Grid item xs={4} sm={3} md={2}>
          <Image
            src={product.imageCollection.items[0].url}
            alt={product.imageCollection.items[0].title}
            layout="responsive"
            objectFit="cover"
            width={100}
            height={100}
          />
        </Grid>

        {/* Name */}
        <Grid item xs={8} sm={9} md={10}>
          <Typography variant="body1">{product.productName}</Typography>
        </Grid>
      </Grid>
    </Link>
  </Grid>
);

const PostProducts = ({ products }) => (
  <Box my={2}>
    <Typography variant="subtitle1" component="h6" gutterBottom>
      Si este post te gustó, acá te dejamos algunos productos que te pueden
      interesar:
    </Typography>
    <Grid container>
      {products.map((product) => (
        <>
          <ProductItem key={product.sys.id} product={product} />
          <Divider />
        </>
      ))}
    </Grid>
  </Box>
);

export default PostProducts;
