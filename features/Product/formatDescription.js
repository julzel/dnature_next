const formatProductDescription = (description) => {
  if (!description) {
    return '';
  }

  return description
    .replaceAll('@', '\n\n')
    .replaceAll('_', '')
    .replaceAll('%', '');
};

export default formatProductDescription;
