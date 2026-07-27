const mapping = require('../mappings/product-avify-skus.json');

const approvedMappings = new Map(
  mapping.products
    .filter((product) => product.approved && product.avifySku)
    .map((product) => [
      product.contentfulEntryId.trim(),
      product.avifySku.trim(),
    ])
);

module.exports = async function backfillAvifySkus(
  migration,
  { makeRequest }
) {
  const locales = await makeRequest({
    method: 'GET',
    url: '/locales',
  });
  const defaultLocale = locales.items.find((locale) => locale.default)?.code;

  if (!defaultLocale) {
    throw new Error('Contentful default locale could not be determined.');
  }

  migration.transformEntries({
    contentType: 'product',
    from: ['productName', 'avifySku'],
    to: ['avifySku'],
    // Every approved mapping was generated from a published Contentful product.
    // Publish explicitly so newly approved links are immediately available.
    shouldPublish: true,
    transformEntryForLocale(fromFields, currentLocale, { id }) {
      if (currentLocale !== defaultLocale) {
        return undefined;
      }

      const approvedSku = approvedMappings.get(id);

      if (!approvedSku) {
        return undefined;
      }

      const existingSku = fromFields.avifySku?.[currentLocale]?.trim();

      if (existingSku && existingSku !== approvedSku) {
        throw new Error(
          `Entry ${id} already has a different avifySku: ${existingSku}`
        );
      }

      if (existingSku === approvedSku) {
        return undefined;
      }

      return { avifySku: approvedSku };
    },
  });
};
