import CatalogContainer from "./Catalog";

const Productos = ({ products, queryCategory }) => (
  <CatalogContainer queryCategory={queryCategory} products={products} />
);

export default Productos;
