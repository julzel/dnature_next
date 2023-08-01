import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, Grid, Typography, CardHeader, CardContent } from '@mui/material';
import { blue } from '@mui/material/colors';

const ProductItem = ({ product }) => (
  <Grid item key={product.sys.id} xs={12} sm={6} md={3} sx={{ padding: 1 }}>
    <Card>
      <Link
        passHref
        href={{
          pathname: `/productos/${product.urlSlug}`,
          query: { id: product.sys.id },
        }}
      >
        <Grid container alignItems="center">
          {/* Thumbnail */}
          <Grid item xs={4} md={4}>
            <Image
              src={product.imageCollection.items[0].url}
              alt={product.imageCollection.items[0].title}
              layout="responsive"
              objectFit="cover"
              width={75}
              height={75}
            />
          </Grid>

          {/* Name */}
          <Grid item xs={8} md={8}>
            <Typography sx={{ fontWeight: 700 }} variant="subtitle2">{product.productName}</Typography>
          </Grid>
        </Grid>
      </Link>
    </Card>
  </Grid>
);

const PostProducts = ({ products }) => (
  <Card sx={{ my: 2, bgcolor: 'tertiary.main' }} elevation={1}>
    <CardHeader
      title={
        <Typography variant="subtitle1" color={'textSecondary'}>
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
