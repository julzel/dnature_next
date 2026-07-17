import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import WhatsAppLink from '../../../WhatsAppLink';

// styles
import styles from './NavigationBar.module.scss';

const NavigationBar = ({ items }) => {
  const pathname = usePathname();
  const activePathname = pathname || '';

  return (
    <nav className={styles.navbar}>
      {items.map((link, i) => (
        <Link href={link.href} key={i}>
          <span
            className={`${styles.navbarItem} ${styles.dark} ${
              activePathname === link.href ? styles.active : ''
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
