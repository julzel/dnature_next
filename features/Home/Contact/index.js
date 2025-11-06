import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-regular-svg-icons';

// local imports
// components
import Map from '../../../components/Map';
import AnimationBox from '../../../components/AnimationBox';
import WhatsAppLink from '../../../components/WhatsAppLink';

// styles
import styles from './Contact.module.scss';

const Contact = () => {
  return (
    <div className={styles.contact}>
      <h3 className={`title ${styles.title}`}>Contáctanos</h3>
      <ul className={styles.contactList}>
        <li>
          <AnimationBox animation='fade-in-from-left'>
            <WhatsAppLink phone='71848868' className={styles.contactItem} withIcon />
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
