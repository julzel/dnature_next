import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

const GoBack = ({ className, productDetail }) => (
  <nav className={className} aria-label='Migas de pan'>
    <ol>
      <li>
        <Link href='/'>Inicio</Link>
      </li>
      <li aria-hidden='true'>
        <ChevronRight size={16} strokeWidth={1.8} />
      </li>
      <li>
        <Link
          href={
            productDetail.categorySlug
              ? {
                  pathname: '/productos',
                  query: { category: productDetail.categorySlug },
                }
              : '/productos'
          }
        >
          {productDetail.category || 'Productos'}
        </Link>
      </li>
      <li aria-hidden='true'>
        <ChevronRight size={16} strokeWidth={1.8} />
      </li>
      <li aria-current='page'>{productDetail.productName}</li>
    </ol>
  </nav>
);

export default GoBack;
