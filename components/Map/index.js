'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

// local imports
import styles from './Map.module.scss';

const STORE_LOCATION = { lat: 9.962592, lng: -84.07752 };

const Map = () => {
  const googlemap = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Intersection Observer to load map only when visible
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        }
      },
      { rootMargin: '100px' }
    );

    if (googlemap.current) {
      observer.observe(googlemap.current);
    }

    return () => {
      if (googlemap.current) {
        observer.unobserve(googlemap.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
      version: 'weekly',
      libraries: ['marker'],
    });
    let map;
    let marker;
    loader.load().then(async () => {
      const { Map } = await google.maps.importLibrary('maps');
      const { AdvancedMarkerElement } =
        await google.maps.importLibrary('marker');

      map = new Map(googlemap.current, {
        center: STORE_LOCATION,
        zoom: 16,
        disableDefaultUI: true,
        mapId: 'DNATURE_MAP', // Required for AdvancedMarkerElement
      });

      marker = new AdvancedMarkerElement({
        position: STORE_LOCATION,
        map,
        title: 'DNAture. #1 en alimentación natural para mascotas',
      });
    });
  }, [isVisible]);

  return (
    <div id="store-map" className={styles.storeMap}>
      <div id="map" ref={googlemap} className={styles.map} />
    </div>
  );
};

export default Map;
