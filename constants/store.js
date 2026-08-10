export const STORE_LOCATION = Object.freeze({
  lat: 9.955621,
  lng: -84.085547,
});

export const STORE_GOOGLE_MAPS_URL =
  `https://www.google.com/maps/search/?api=1&query=${STORE_LOCATION.lat},${STORE_LOCATION.lng}`;
