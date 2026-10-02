import { STORE_LOCATION } from '../../../../constants/store';

const GOOGLE_MAPS_ENABLED = Boolean(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY);
const mapUrl = `https://www.google.com/maps?q=${STORE_LOCATION.lat},${STORE_LOCATION.lng}&z=16&output=embed`;

const Map = () => (
  <div id='store-map' role='region' aria-label='Mapa de la ubicación de DNAture'>
    {GOOGLE_MAPS_ENABLED ? (
      <iframe
        title='Mapa de la ubicación de DNAture'
        src={mapUrl}
        width={300}
        height={300}
        loading='lazy'
      />
    ) : (
      <p role='status'>Ubicación de DNAture: Colima de Tibás, San José</p>
    )}
  </div>
);

export default Map;
