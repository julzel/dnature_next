import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import WhatsAppLink from '../../../WhatsAppLink';

// styles
import styles from './NavigationBar.module.scss';

const NavigationBar = ({ items }) => {
  const router = useRouter();

  return (
    <nav className={styles.navbar}>
      {items.map((link, i) => (
        <Link href={link.href} passHref key={i}>
          <span
            className={`${styles.navbarItem} ${styles.dark} ${
              router.pathname == link.href ? styles.active : ''
            }`}
          >
            {link.label}
          </span>
        </Link>
      ))}
      <span className={`${styles.navbarItem} ${styles.dark}`}>
        <WhatsAppLink phone='71848868' iconOnly />
      </span>
    </nav>
  );
};

export default NavigationBar;
