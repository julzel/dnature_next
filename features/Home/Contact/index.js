import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-regular-svg-icons';

// local imports
// components
import Map from '../../../components/Map';
import AnimationBox from '../../../components/AnimationBox';

// styles
import styles from './Contact.module.scss';
import CursiveTitle from '../../../components/CursiveTitle';

const Contact = () => {
  return (
    <div className={styles.contact}>
      <CursiveTitle>Contáctanos</CursiveTitle>
      
      <ul className={styles.contactList}>
        <li>
          <AnimationBox animation='fade-in-from-left'>
            <span className={styles.contactIcon}>
              <FontAwesomeIcon icon={faWhatsapp} size='2x' />
            </span>
            <a href='tel:50671732328' className={styles.contactItem}>
              7173 - 2328
            </a>
          </AnimationBox>
        </li>

        <li>
          <AnimationBox animation='fade-in-from-left'>
            <span className={styles.contactIcon}>
              <FontAwesomeIcon icon={faInstagram} size='2x' />
            </span>
            <a
              className={styles.contactItem}
              href='https://www.instagram.com/dnaturecr'
              target='_blank'
              rel='noopener noreferrer'
            >
              @dnaturecr
            </a>
          </AnimationBox>
        </li>

        <li>
          <AnimationBox animation='fade-in-from-left'>
            <span className={styles.contactIcon}>
              <FontAwesomeIcon icon={faEnvelope} size='2x' />
            </span>
            <a
              href='mailto:info@dnaturefood.com'
              className={styles.contactItem}
            >
              info@dnaturefood.com
            </a>
          </AnimationBox>
        </li>
      </ul>
      <Map />
    </div>
  );
};

export default Contact;
