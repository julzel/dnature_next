// local imports
// components
import Filter from "../../../components/Filter";
import CatalogTitle from "../CatalogTitle";
import CatalogList from "../CatalogList";

// styles
import styles from "./Catalog.module.scss";

const Catalog = ({
  categoriesList,
  selectedCategory,
  filterOptions,
  handleSelectedCategoryChange,
}) => (
  <section className={styles.catalog}>

    <Filter
      options={filterOptions}
      selected={selectedCategory}
      onOptionSelect={handleSelectedCategoryChange}
    />
    {selectedCategory === 'all' ? (
        <div>
          {categoriesList.map((category) => {
            return (
              <div className={styles.category} key={category.id || selectedCategory}>
                <CatalogTitle text={category.label} />
                <CatalogList products={category.products} />
              </div>
            );
          })}
        </div>
      ) : (
        <div className={styles.category}>
          <CatalogTitle text={selectedCategory.label} />
          <CatalogList products={selectedCategory.products} />
        </div>
      )}
  </section>
);

export default Catalog;
