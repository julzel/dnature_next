import React, { useEffect, useRef } from 'react'
import { Loader } from '@googlemaps/js-api-loader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faInstagram,
    faWhatsapp,
    faFacebookSquare,
} from '@fortawesome/free-brands-svg-icons'
import {
    faCompass,
    faEnvelope
} from '@fortawesome/free-regular-svg-icons'
import '@fortawesome/fontawesome-svg-core/styles.css'

// local imports

// styles
import styles from './Map.module.scss'

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
                zoom: 1,
                zoomControl: false,
                streetViewControl: false,
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
        <>
            <div className={styles.locationMap}>
                <h3 className={`title ${styles.locationMapTitle}`}>Contáctanos</h3>
                <ul className={styles.locationMapList}>
                    <li>
                        <span className={styles.locationMapIcon}>
                            <FontAwesomeIcon icon={faWhatsapp} size='2x' />
                        </span>
                        <a href="tel:5067132328" className={styles.locationMapItem}>7113 - 2328</a>
                    </li>
                    <li>
                        <span className={styles.locationMapIcon}>
                            <FontAwesomeIcon icon={faInstagram} size='2x' />
                        </span>
                        <a
                            className={styles.locationMapItem}
                            href='https://www.instagram.com/dnaturecr'
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            @dnaturecr
                        </a>
                    </li>
                    {/* <li>
                        <span className={styles.locationMapIcon}>
                            <FontAwesomeIcon icon={faFacebookSquare} size='2x' />
                        </span>
                        <a
                            className={styles.locationMapItem}
                            href='https://www.facebook.com/DNAture-CR-101452441881633/'
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            DNAture CR
                        </a>
                    </li> */}
                    <li>
                        <span className={styles.locationMapIcon}>
                            <FontAwesomeIcon icon={faEnvelope} size='2x' />
                        </span>
                        <a href="mailto:info@dnaturefood.com" className={styles.locationMapItem}>info@dnaturefood.com</a>
                    </li>
                    <li>
                        <span className={styles.locationMapIcon}>
                            <FontAwesomeIcon icon={faCompass} size='2x' />
                        </span>
                        <span className={styles.locationMapItem}>Nuestro local</span>
                    </li>
                </ul>
                <div id="store-map">
                    <div id="map" ref={googlemap} />
                </div>
            </div>
        </>
    )
}

export default Map
