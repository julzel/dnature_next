import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faInstagram,
    faWhatsapp,
    //faFacebookSquare,
} from '@fortawesome/free-brands-svg-icons'
import {
    faCompass,
    faEnvelope
} from '@fortawesome/free-regular-svg-icons'
import '@fortawesome/fontawesome-svg-core/styles.css'

// local imports
// components
import Map from '../../../Map'

// styles
import styles from './Contact.module.scss'

const Contact = () => {
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
                        <span className={styles.locationMapItem}>Nuestro local en Tibás</span>
                    </li>
                </ul>
                <Map />
            </div>
        </>
    )
}

export default Contact
