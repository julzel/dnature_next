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
    {selectedCategory && (
      <>
        <Filter
          options={filterOptions}
          selected={selectedCategory}
          onOptionSelect={handleSelectedCategoryChange}
        />
        {selectedCategory.id === "all" ? (
          <div>
            {categoriesList.map((category) => {
              return (
                <div
                  className={styles.category}
                  key={category.id || selectedCategory}
                >
                  <CatalogTitle text={category.label} />
                  {categoriesList && (
                    <CatalogList products={category.products} />
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className={styles.category}>
            <CatalogTitle text={selectedCategory.label} />
            {selectedCategory.id && (
              <CatalogList products={selectedCategory.products} />
            )}
          </div>
        )}
      </>
    )}
  </section>
);

export default Catalog;
