import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, Grid, Typography, CardHeader, CardContent } from '@mui/material';
import { grey, lime } from '@mui/material/colors';

const ProductItem = ({ product }) => (
  <Grid item key={product.sys.id} xs={12} sm={6} md={3} sx={{ padding: 1 }}>
    <Card
      sx={{
        bgcolor: lime[300],
        mb: 2,
        ':active': {
          bgcolor: lime[500],
          transform: 'scale(0.99)',
          transition: 'all 0.1s ease-in-out',
        },
      }}
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
          <Grid item xs={4} md={4} p={1}>
            <Image
              src={product.imageCollection.items[0].url}
              alt={product.imageCollection.items[0].title}
              layout="responsive"
              objectFit="cover"
              width={75}
              height={75}
              style={{ borderRadius: '50%' }}
            />
          </Grid>

          {/* Name */}
          <Grid item xs={8} md={8}>
            <Typography color="textSecondary" sx={{ fontWeight: 700 }} variant="subtitle2" px={[1, 2]}>
              {product.productName}
            </Typography>
          </Grid>
        </Grid>
      </Link>
    </Card>
  </Grid>
);

const PostProducts = ({ products, category }) => (
  <Card elevation={1}>
    <CardHeader
      title={
        <Typography variant="subtitle1" color="secondaryText">
          Si te gustó este post, acá te compartimos algunos productos que te
          pueden interesar:
        </Typography>
      }
    />
    <CardContent>
      <Grid container>
        {products.map((product) => (
          <ProductItem product={product} key={product.sys.id} />
        ))}
      </Grid>
    </CardContent>
  </Card>
);

export default PostProducts;
