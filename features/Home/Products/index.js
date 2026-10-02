import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import Button from '../../../components/Button';
import ContentfulImage from '../../../components/ContentfulImage';

const Products = ({ categories = [] }) => {
  const availableCategories = Array.isArray(categories)
    ? categories.filter(
        (category) =>
          category?.slug && category?.label && category?.image?.url
      )
    : [];

  return (
    <section aria-labelledby='home-products-title'>
      <div>
        <div>
          <p>Elegí lo que necesita</p>
          <h2 id='home-products-title'>Nuestros productos</h2>
          <p>
            Recetas, proteínas, snacks y suplementos elaborados para sumar
            variedad a su alimentación.
          </p>
        </div>
        <Button
          href='/productos'
          variant='secondary'
          iconEnd={<ArrowRight size={18} aria-hidden='true' />}
        >
          Ver todo el catálogo
        </Button>
      </div>

      {availableCategories.length ? (
        <ul>
          {availableCategories.map((category) => (
            <li key={category.slug}>
              <Link
                href={`/productos?category=${category.slug}`}
              >
                <div>
                  <ContentfulImage
                    src={category.image.url}
                    alt={category.image.title || category.label}
                    width={640}
                    height={480}
                    sizes='(min-width: 1024px) 25vw, (min-width: 576px) 50vw, 100vw'
                  />
                </div>
                <div>
                  <h3>{category.label}</h3>
                  <span>
                    Explorar
                    <ArrowRight size={17} aria-hidden='true' />
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>
          Estamos preparando nuestras categorías. Podés consultar el catálogo
          completo mientras tanto.
        </p>
      )}
    </section>
  );
};

export default Products;
