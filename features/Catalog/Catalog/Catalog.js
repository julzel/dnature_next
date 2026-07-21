// local imports
// components
import Filter from '../Filter';
import CatalogList from '../CatalogList';

// styles
import styles from "./Catalog.module.scss";

const Catalog = ({
  selectedCategory,
  filterOptions,
  products,
  totalCount,
}) => (
  <section className={styles.catalog}>
    <div className={styles.pageHeader}>
      <p className={styles.eyebrow}>{selectedCategory.label}</p>
      <h1>Nuestros productos</h1>
      <p className={styles.resultCount} aria-live='polite'>
        {totalCount} {totalCount === 1 ? 'producto' : 'productos'}
      </p>
    </div>
    <Filter options={filterOptions} selected={selectedCategory} />
    <div className={styles.catalogContent}>
      <CatalogList products={products} />
    </div>
  </section>
);

export default Catalog;
