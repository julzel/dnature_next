import CatalogContainer from "./Catalog";

const Productos = ({ products, queryCategory }) => (
  <>
    <h1 className="visually-hidden">Productos naturales para mascotas</h1>
    <CatalogContainer queryCategory={queryCategory} products={products} />
  </>
);

export default Productos;
