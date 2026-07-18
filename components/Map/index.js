'use client';

import React, { useEffect, useRef } from 'react';
import { importLibrary, setOptions } from '@googlemaps/js-api-loader';

// local imports
import styles from './Map.module.scss';

const STORE_LOCATION = { lat: 9.955621, lng: -84.085547 };
const MAP_ID = process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID || 'DEMO_MAP_ID';

let loaderConfigured = false;

const Map = () => {
  const googlemap = useRef(null);

  useEffect(() => {
    let cancelled = false;
    let marker;

    const initializeMap = async () => {
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
  }, []);

  return (
    <div id="store-map" className={styles.storeMap}>
      <div id="map" ref={googlemap} className={styles.map} />
    </div>
  );
};
 
export default Map;
