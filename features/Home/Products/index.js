import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import Button from '../../../components/Button';
import ContentfulImage from '../../../components/ContentfulImage';
import styles from './Products.module.scss';

const Products = ({ categories = [] }) => {
  const availableCategories = Array.isArray(categories)
    ? categories.filter(
        (category) =>
          category?.slug && category?.label && category?.image?.url
      )
    : [];

  return (
    <section className={styles.products} aria-labelledby='home-products-title'>
      <div className={styles.heading}>
        <div>
          <p className={styles.eyebrow}>Elegí lo que necesita</p>
          <h2 id='home-products-title'>Nuestros productos</h2>
          <p className={styles.introduction}>
            Recetas, proteínas, snacks y suplementos elaborados para sumar
            variedad a su alimentación.
          </p>
        </div>
        <Button
          href='/productos'
          variant='secondary'
          iconEnd={<ArrowRight size={18} aria-hidden='true' />}
          className={styles.viewAll}
        >
          Ver todo el catálogo
        </Button>
      </div>

      {availableCategories.length ? (
        <ul className={styles.categories}>
          {availableCategories.map((category) => (
            <li key={category.slug} className={styles.category}>
              <Link
                href={`/productos?category=${category.slug}`}
                className={styles.categoryLink}
              >
                <div className={styles.imageFrame}>
                  <ContentfulImage
                    src={category.image.url}
                    alt={category.image.title || category.label}
                    width={640}
                    height={480}
                    sizes='(min-width: 1024px) 25vw, (min-width: 576px) 50vw, 100vw'
                    className={styles.image}
                  />
                </div>
                <div className={styles.categoryContent}>
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
        <p className={styles.emptyState}>
          Estamos preparando nuestras categorías. Podés consultar el catálogo
          completo mientras tanto.
        </p>
      )}
    </section>
  );
};

export default Products;
