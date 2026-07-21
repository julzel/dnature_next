import React from 'react';
import Link from 'next/link';

const GoBack = ({ className, productName }) => {
  return (
    <nav className={className} aria-label='Migas de pan'>
      <Link href='/productos'>Productos</Link>
      <span aria-hidden='true'>/</span>
      <span aria-current='page'>{productName}</span>
    </nav>
  );
};

export default GoBack;
