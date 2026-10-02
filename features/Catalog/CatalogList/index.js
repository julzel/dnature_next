import React from 'react';

// local imports

// components
import CatalogItem from '../CatalogItem';

const CatalogList = ({ products }) => (
  <ul>
    {products.map((product) => (
      <li key={product.sys.id}>
        <CatalogItem product={product} />
      </li>
    ))}
  </ul>
);

export default CatalogList;
