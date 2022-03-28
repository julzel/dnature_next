import React, { useEffect, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

const STORE_LOCATION = { lat: 9.959968745311736, lng: -84.07861948155853 }

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
                zoom: 15,
                disableDefaultUI: true
            });
            marker = new google.maps.Marker({
                position: STORE_LOCATION,
                map,
                title: "DNAture. #1 en alimentación natural",
              });
            marker.setMap(map);
        });
    });

    return (
        <div id="store-map">
            <div id="map" ref={googlemap} />
        </div>
    );
}
 
export default Map;