import { listAvifyProducts } from '../../services/avify';

import styles from './AvifyDiagnostics.module.scss';

const formatValue = (value) =>
  value === null || value === undefined || value === '' ? '—' : String(value);

const ResultCard = ({ id, title, result }) => (
  <article className={styles.resultCard}>
    <h3 id={id}>{title}</h3>
    <div
      aria-labelledby={id}
      className={result.success ? styles.success : styles.error}
      role="status"
    >
      <strong>
        {result.success ? 'Conexión autenticada' : 'No se pudo autenticar'}
      </strong>
      <p>{result.message}</p>
    </div>

    <details className={styles.details}>
      <summary>Ver respuesta segura</summary>
      <pre>{JSON.stringify(result, null, 2)}</pre>
    </details>
  </article>
);

const ProductTable = ({ products }) => (
  <div className={styles.tableWrapper}>
    <table>
      <thead>
        <tr>
          <th scope="col">ID</th>
          <th scope="col">Nombre</th>
          <th scope="col">SKU</th>
          <th scope="col">Precio</th>
          <th scope="col">Cantidad</th>
          <th scope="col">Estado</th>
          <th scope="col">Variantes</th>
        </tr>
      </thead>
      <tbody>
        {products.map((product, index) => (
          <tr key={product.id ?? product.sku ?? index}>
            <td>{formatValue(product.id)}</td>
            <td>{formatValue(product.name)}</td>
            <td>
              <code>{formatValue(product.sku)}</code>
            </td>
            <td>{formatValue(product.price)}</td>
            <td>{formatValue(product.quantity)}</td>
            <td>{formatValue(product.status)}</td>
            <td>{product.variantCount}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const AvifyDiagnostics = async () => {
  const productResult = await listAvifyProducts({ pageNum: 1, pageSize: 10 });

  return (
    <main className={styles.main}>
      <h1>Pruebas de integración con Avify</h1>
      <p>
        Esta página solo está disponible durante el desarrollo. La API key nunca
        se envía al navegador.
      </p>

      <section aria-labelledby="avify-authentication-heading">
        <h2 id="avify-authentication-heading">Autenticación</h2>
        <p>
          La consulta de productos verifica la conexión GraphQL y la API key.
        </p>

        <ResultCard
          id="avify-graphql-authentication"
          result={productResult}
          title="GraphQL"
        />
      </section>

      <section aria-labelledby="avify-products-heading">
        <h2 id="avify-products-heading">Productos</h2>
        <p>
          Primera página de productos obtenida directamente desde Avify con un
          máximo de 10 resultados.
        </p>

        {productResult.success ? (
          <>
            <div className={styles.success} role="status">
              <strong>Consulta completada</strong>
              <p>
                Se recibieron {productResult.products.length} de{' '}
                {productResult.totalCount} productos.
              </p>
            </div>

            {productResult.products.length > 0 ? (
              <ProductTable products={productResult.products} />
            ) : (
              <p>Avify no devolvió productos para esta página.</p>
            )}
          </>
        ) : (
          <div className={styles.error} role="alert">
            <strong>No se pudieron cargar los productos</strong>
            <p>{productResult.message}</p>
          </div>
        )}
      </section>
    </main>
  );
};

export default AvifyDiagnostics;
