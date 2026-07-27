module.exports = function makeCategoryTestOptional(migration) {
  migration
    .editContentType('product')
    .editField('categoryTest')
    .required(false);
};
