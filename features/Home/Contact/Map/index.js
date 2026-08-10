'use client';

import { useEffect, useRef, useState } from 'react';

// local imports
import styles from './Map.module.scss';
import { STORE_LOCATION } from '../../../../constants/store';
const MAP_ID = process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID || 'DEMO_MAP_ID';

let loaderConfigured = false;

const Map = () => {
  const container = useRef(null);
  const googlemap = useRef(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: '300px' }
    );

    if (container.current) observer.observe(container.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!shouldLoad) return undefined;

    let cancelled = false;
    let marker;

    const initializeMap = async () => {
      const { importLibrary, setOptions } = await import('@googlemaps/js-api-loader');

      if (!loaderConfigured) {
        setOptions({
          key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
          v: 'weekly',
          mapIds: [MAP_ID],
        });
        loaderConfigured = true;
      }

      const [{ Map: GoogleMap }, { AdvancedMarkerElement }] =
        await Promise.all([
          importLibrary('maps'),
          importLibrary('marker'),
        ]);

      if (cancelled || !googlemap.current) {
        return;
      }

      const map = new GoogleMap(googlemap.current, {
        center: STORE_LOCATION,
        zoom: 16,
        disableDefaultUI: true,
        mapId: MAP_ID,
      });

      marker = new AdvancedMarkerElement({
        position: STORE_LOCATION,
        map,
        title: 'DNAture. #1 en alimentación natural para mascotas',
      });
    };

    initializeMap().catch((error) => {
      console.error('Failed to load Google Map:', error);
    });

    return () => {
      cancelled = true;
      if (marker) {
        marker.map = null;
      }
    };
  }, [shouldLoad]);

  return (
    <div id="store-map" ref={container} className={styles.storeMap}>
      <div id="map" ref={googlemap} className={styles.map} />
    </div>
  );
};
 
export default Map;
