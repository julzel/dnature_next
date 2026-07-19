// local imports
// components
import Filter from "../Filter";
import CatalogTitle from "../CatalogTitle";
import CatalogList from "../CatalogList";
import SearchBar from "../SearchBar";

// styles
import styles from "./Catalog.module.scss";

const Catalog = ({
  categoriesList,
  selectedCategory,
  filterOptions,
  searchQuery,
  onSearchChange,
  suggestions,
}) => (
  <section className={styles.catalog}>
    {selectedCategory && (
      <>
        <Filter options={filterOptions} selected={selectedCategory} />
        <div className={styles.catalogContent}>
          <div className={styles.searchWrapper}>
            <SearchBar
              query={searchQuery}
              onChange={onSearchChange}
              suggestions={suggestions}
            />
          </div>
          {selectedCategory.id === "all" ? (
            <div>
              {categoriesList.map((category) => {
                return (
                  <div
                    className={styles.category}
                    key={category.id || category.label}
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
        </div>
      </>
    )}
  </section>
);

export default Catalog;
