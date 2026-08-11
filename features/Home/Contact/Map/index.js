'use client';

import { useEffect, useRef, useState } from 'react';
import { MapPin } from 'lucide-react';

// local imports
import styles from './Map.module.scss';
import { STORE_LOCATION } from '../../../../constants/store';
const MAP_ID = process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID || 'DEMO_MAP_ID';
const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

let loaderConfigured = false;

const Map = () => {
  const container = useRef(null);
  const googlemap = useRef(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [status, setStatus] = useState(
    GOOGLE_MAPS_API_KEY ? 'idle' : 'unavailable'
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (GOOGLE_MAPS_API_KEY) setStatus('loading');
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
    if (!shouldLoad || !GOOGLE_MAPS_API_KEY) return undefined;

    let cancelled = false;
    let marker;

    const initializeMap = async () => {
      const { importLibrary, setOptions } = await import('@googlemaps/js-api-loader');

      if (!loaderConfigured) {
        setOptions({
          key: GOOGLE_MAPS_API_KEY,
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

      setStatus('ready');
    };

    initializeMap().catch((error) => {
      console.error('Failed to load Google Map:', error);
      if (!cancelled) setStatus('error');
    });

    return () => {
      cancelled = true;
      if (marker) {
        marker.map = null;
      }
    };
  }, [shouldLoad]);

  const isReady = status === 'ready';
  const statusMessage =
    status === 'loading'
      ? 'Cargando ubicación…'
      : 'Ubicación de DNAture';

  return (
    <div
      id='store-map'
      ref={container}
      className={styles.storeMap}
      role='region'
      aria-label='Mapa de la ubicación de DNAture'
    >
      <div
        id='map'
        ref={googlemap}
        className={`${styles.map} ${isReady ? styles.mapReady : ''}`}
      />
      {!isReady ? (
        <div
          className={styles.mapFallback}
          role={status === 'error' || status === 'unavailable' ? 'status' : undefined}
        >
          <span aria-hidden='true'>
            <MapPin size={28} strokeWidth={1.8} />
          </span>
          <strong>{statusMessage}</strong>
          <small>Colima de Tibás, San José</small>
        </div>
      ) : null}
    </div>
  );
};
 
export default Map;
