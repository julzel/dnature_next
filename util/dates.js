const getDateDMY = () => {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, "0");
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const year = today.getFullYear();
  return day + "/" + month + "/" + year;
};


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


export { getDateDMY, formatToLocaleDate };
