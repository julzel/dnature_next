const NEW_LINE = '<br />';
const SPAN = '</span>';

const formatProductDescription = (description) => {
  if (!description) {
    return '';
  }

  return description
    .replaceAll('-', `${NEW_LINE}- `)
    .replaceAll('_', '<span>')
    .replaceAll('%', `%${SPAN}${NEW_LINE}`)
    .replace('@', `${NEW_LINE}${NEW_LINE}<div>`)
    .replace('@', '<div>');
};

export default formatProductDescription;
