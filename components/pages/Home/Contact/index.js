import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faInstagram,
    faWhatsapp,
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
import AnimationBox from '../../../AnimationBox'

const Contact = () => {
    return (
        <div className={styles.contact}>
            <div className={styles.contactImage} />
            <h3 className={`title ${styles.contactTitle}`}>Contáctanos</h3>
            <ul className={styles.contactList}>
                <AnimationBox animation='fade-in-from-left'>
                    <li>
                        <span className={styles.contactIcon}>
                            <FontAwesomeIcon icon={faWhatsapp} size='2x' />
                        </span>
                        <a href="tel:5067132328" className={styles.contactItem}>7113 - 2328</a>
                    </li>
                </AnimationBox>

                <AnimationBox animation='fade-in-from-left'>
                    <li>
                        <span className={styles.contactIcon}>
                            <FontAwesomeIcon icon={faInstagram} size='2x' />
                        </span>
                        <a
                            className={styles.contactItem}
                            href='https://www.instagram.com/dnaturecr'
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            @dnaturecr
                        </a>
                    </li>
                </AnimationBox>

                <AnimationBox animation='fade-in-from-left'>
                    <li>
                        <span className={styles.contactIcon}>
                            <FontAwesomeIcon icon={faEnvelope} size='2x' />
                        </span>
                        <a href="mailto:info@dnaturefood.com" className={styles.contactItem}>info@dnaturefood.com</a>
                    </li>
                </AnimationBox>

            </ul>
            <Map />
        </div>
    )
}

export default Contact
