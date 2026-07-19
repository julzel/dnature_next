import React from 'react';
import Image from 'next/image';

// local imports
// styles
import styles from './Footer.module.scss';

const Footer = () => {
  const date = new Date().getFullYear();
  return (
    <footer className={styles.footer}>
      <p>
        <span>
          <Image
            src='/images/dnature-logo.svg'
            alt='DNAture Logo'
            width={55}
            height={43}
            loading='eager'
          />
        </span>
      </p>
      <p>Todos los derechos reservados.</p>
      <p>Costa Rica, {date}.</p>
    </footer>
  );
};

export default Footer;
