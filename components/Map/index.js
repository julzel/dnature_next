import React, { useEffect, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

// local imports
import styles from './Map.module.scss'

const STORE_LOCATION = { lat: 9.962592, lng: -84.07752 }

const Map = () => {
    const googlemap = useRef(null);

    useEffect(() => {
        const loader = new Loader({
            apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
            version: 'weekly',
        });
        let map;
        let marker;
        loader.load().then(() => {
            const google = window.google; // ADDED
            map = new google.maps.Map(googlemap.current, {
                center: STORE_LOCATION,
                zoom: 16,
                disableDefaultUI: true
            });
            marker = new google.maps.Marker({
                position: STORE_LOCATION,
                map,
                title: "DNAture. #1 en alimentación natural para mascotas",
              });
            marker.setMap(map);
        });
    });

    return (
        <div id="store-map" className={styles.storeMap}>
            <div id="map" ref={googlemap} className={styles.map}/>
        </div>
    );
}
 
export default Map;