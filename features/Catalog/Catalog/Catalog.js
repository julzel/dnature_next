// local imports
// components
import Filter from '../Filter';
import CatalogList from '../CatalogList';

const Catalog = ({
  selectedCategory,
  filterOptions,
  products,
  totalCount,
}) => (
  <section className='catalog-page store-shell'>
    <header>
      <div>
        <p>{selectedCategory.label}</p>
        <h1>Nuestros productos</h1>
        <p aria-live='polite'>
          {totalCount} {totalCount === 1 ? 'producto' : 'productos'}
        </p>
      </div>
    </header>
    <Filter options={filterOptions} selected={selectedCategory} />
    <div>
      <CatalogList products={products} />
    </div>
  </section>
);

export default Catalog;
