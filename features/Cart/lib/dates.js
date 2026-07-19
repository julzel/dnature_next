const formatToLocaleDate = (date) => {
  // Create a Date object
  const dateObject = new Date(date);
  // Format date to local string in day-month-year order
  return dateObject.toLocaleString('es-419', {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
  });
};


export { formatToLocaleDate };
