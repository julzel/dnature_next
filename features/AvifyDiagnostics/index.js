import { getCatalogReconciliation } from './server';

import styles from './AvifyDiagnostics.module.scss';

const currencyFormatter = new Intl.NumberFormat('es-CR', {
  currency: 'CRC',
  maximumFractionDigits: 0,
  style: 'currency',
});

const formatCurrency = (value) =>
  typeof value === 'number' ? currencyFormatter.format(value) : '—';

const SummaryCard = ({ label, value, detail }) => (
  <article className={styles.summaryCard}>
    <span>{label}</span>
    <strong>{value}</strong>
    <small>{detail}</small>
  </article>
);

const CategoryList = ({ categories }) => (
  <ul className={styles.categoryList}>
    {Object.entries(categories).map(([category, count]) => (
      <li key={category}>
        <span>{category}</span>
        <strong>{count}</strong>
      </li>
    ))}
  </ul>
);

const AvifyDiagnostics = async () => {
  const result = await getCatalogReconciliation();

  if (!result.success) {
    return (
      <main className={styles.main}>
        <h1>Conciliación Contentful ↔ Avify</h1>
        <div className={styles.error} role="alert">
          <strong>No se pudo generar el reporte</strong>
          <p>{result.message}</p>
          {result.developmentDetails ? (
            <code>{result.developmentDetails}</code>
          ) : null}
        </div>
      </main>
    );
  }

  const { report } = result;
  const linkedCount = report.summary.matched + report.summary.likely;
  const baseInactive = report.avifyHealth.baseStatuses.inactive || 0;
  const variantsActive = report.avifyHealth.variantStatuses.active || 0;

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <p className={styles.eyebrow}>Reporte de desarrollo</p>
        <h1>Conciliación Contentful ↔ Avify</h1>
        <p>
          Contentful aporta contenido editorial; Avify debe convertirse en la
          fuente de precios, presentaciones e inventario.
        </p>
      </header>

      <section aria-labelledby="summary-heading">
        <h2 id="summary-heading">Estado actual</h2>
        <div className={styles.summaryGrid}>
          <SummaryCard
            detail="entradas editoriales"
            label="Contentful"
            value={report.summary.contentfulTotal}
          />
          <SummaryCard
            detail={`${report.summary.avifyVariantTotal} variantes`}
            label="Avify"
            value={report.summary.avifyBaseTotal}
          />
          <SummaryCard
            detail={`${report.summary.matched} exactas · ${report.summary.likely} probables`}
            label="Vinculables"
            value={linkedCount}
          />
          <SummaryCard
            detail="requieren decisión humana"
            label="Por revisar"
            value={report.summary.needsReview}
          />
          <SummaryCard
            detail="después de excluir Materia Prima"
            label="Avify sin vínculo"
            value={report.summary.avifyUnpaired}
          />
        </div>
      </section>

      <section aria-labelledby="findings-heading">
        <h2 id="findings-heading">Hallazgos importantes</h2>
        <div className={styles.findings}>
          <article>
            <strong>Falta una llave compartida</strong>
            <p>
              Contentful no guarda SKU ni ID de Avify. Además,{' '}
              {report.avifyHealth.missingBaseCustomSku} productos base y{' '}
              {report.avifyHealth.missingVariantCustomSku} variantes no tienen{' '}
              <code>customSku</code>; la unión debe usar el SKU generado.
            </p>
          </article>
          <article>
            <strong>{report.summary.avifyInternal} productos internos</strong>
            <p>
              Están categorizados como Materia Prima y deben excluirse del
              catálogo público. Otros {report.avifyHealth.uncategorized} no
              tienen categoría.
            </p>
          </article>
          <article>
            <strong>El estado del producto padre no sirve para vender</strong>
            <p>
              {baseInactive} productos base aparecen inactivos, mientras{' '}
              {variantsActive} variantes aparecen activas. La disponibilidad
              debe calcularse por variante; {report.avifyHealth.zeroStockVariants}{' '}
              variantes tienen existencia cero.
            </p>
          </article>
          <article>
            <strong>Contentful necesita limpieza editorial</strong>
            <p>
              {report.contentfulHealth.missingSlug.length} entrada sin slug,{' '}
              {report.contentfulHealth.missingDescription} sin descripción y{' '}
              {report.contentfulHealth.missingIngredients} sin ingredientes.
              Solo {report.contentfulHealth.withPresentationPrices} guardan
              precios por presentación.
            </p>
          </article>
        </div>
      </section>

      <section aria-labelledby="price-heading">
        <h2 id="price-heading">
          Diferencias de precio ({report.priceDifferences.length})
        </h2>
        {report.priceDifferences.length ? (
          <div className={styles.tableWrapper}>
            <table>
              <thead>
                <tr>
                  <th scope="col">Producto</th>
                  <th scope="col">Presentación</th>
                  <th scope="col">Contentful</th>
                  <th scope="col">Avify</th>
                  <th scope="col">Problema</th>
                </tr>
              </thead>
              <tbody>
                {report.priceDifferences.map((difference) => (
                  <tr
                    key={`${difference.product}-${difference.presentation}-${difference.type}`}
                  >
                    <td>{difference.product}</td>
                    <td>{difference.presentation}</td>
                    <td>{formatCurrency(difference.contentfulPrice)}</td>
                    <td>{formatCurrency(difference.avifyPrice)}</td>
                    <td>{difference.detail}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No se detectaron diferencias en las coincidencias exactas.</p>
        )}
      </section>

      <section aria-labelledby="review-heading">
        <h2 id="review-heading">
          Productos que requieren revisión ({report.reviewItems.length})
        </h2>
        <p>
          Estos productos no deben enlazarse automáticamente. La sugerencia solo
          sirve como punto de partida.
        </p>
        <div className={styles.tableWrapper}>
          <table>
            <thead>
              <tr>
                <th scope="col">Contentful</th>
                <th scope="col">Mejor candidato en Avify</th>
                <th scope="col">SKU</th>
                <th scope="col">Señal</th>
              </tr>
            </thead>
            <tbody>
              {report.reviewItems.map((item) => (
                <tr key={item.contentfulId}>
                  <td>{item.contentfulName}</td>
                  <td>{item.candidateName || 'Sin candidato'}</td>
                  <td>
                    <code>{item.candidateSku || '—'}</code>
                  </td>
                  <td>
                    {item.ambiguous
                      ? 'Ambiguo'
                      : item.score < 0.45
                        ? 'Sin coincidencia clara'
                        : 'Revisar nombre'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section aria-labelledby="likely-heading">
        <h2 id="likely-heading">
          Coincidencias probables ({report.likelyItems.length})
        </h2>
        <div className={styles.tableWrapper}>
          <table>
            <thead>
              <tr>
                <th scope="col">Contentful</th>
                <th scope="col">Avify</th>
                <th scope="col">SKU</th>
                <th scope="col">Confianza</th>
              </tr>
            </thead>
            <tbody>
              {report.likelyItems.map((item) => (
                <tr key={item.contentfulId}>
                  <td>{item.contentfulName}</td>
                  <td>{item.avifyName}</td>
                  <td>
                    <code>{item.avifySku}</code>
                  </td>
                  <td>{Math.round(item.score * 100)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section aria-labelledby="categories-heading">
        <h2 id="categories-heading">Categorías</h2>
        <div className={styles.categoryColumns}>
          <article>
            <h3>Contentful</h3>
            <CategoryList categories={report.categories.contentful} />
          </article>
          <article>
            <h3>Avify</h3>
            <CategoryList categories={report.categories.avify} />
          </article>
        </div>
      </section>

      <section aria-labelledby="next-step-heading">
        <h2 id="next-step-heading">Siguiente paso recomendado</h2>
        <ol className={styles.steps}>
          <li>
            Crear en Contentful un campo único <code>avifySku</code> para guardar
            el SKU generado del producto padre en Avify.
          </li>
          <li>
            Confirmar primero las {linkedCount} coincidencias exactas/probables y
            resolver manualmente las {report.summary.needsReview} restantes.
          </li>
          <li>
            Definir una lista explícita de categorías de Avify visibles en web;
            no publicar automáticamente los {report.summary.avifyUnpaired}{' '}
            productos todavía no vinculados.
          </li>
          <li>
            Después del mapeo, leer precio, variante, estado y existencia desde
            Avify; conservar nombre editorial, slug, imágenes, descripción e
            ingredientes en Contentful.
          </li>
        </ol>
      </section>
    </main>
  );
};

export default AvifyDiagnostics;
