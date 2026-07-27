module.exports = function addAvifySku(migration) {
  const product = migration.editContentType('product');

  product
    .createField('avifySku')
    .name('Avify parent SKU')
    .type('Symbol')
    .localized(false)
    .required(false)
    .validations([{ unique: true }]);

  product.changeFieldControl('avifySku', 'builtin', 'singleLine', {
    // in spanish: "SKU del producto padre en Avify. No usar customSku ni SKU de variante.",
    helpText:
      'SKU del producto padre en Avify. No usar customSku ni SKU de variante.',
  });
};
