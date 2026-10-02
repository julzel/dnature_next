import React from 'react';

// local imports

// components
import CatalogItem from '../CatalogItem';

const CatalogList = ({ products }) => (
  <ul className='product-grid'>
    {products.map((product, index) => (
      <li key={product.sys.id}>
        <CatalogItem product={product} imageLoading={index < 3 ? 'eager' : 'lazy'} />
      </li>
    ))}
  </ul>
);

export default CatalogList;
