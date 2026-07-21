'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// styles
import styles from './NavigationBar.module.scss';

const NavigationBar = ({ items }) => {
  const pathname = usePathname();
  const activePathname = pathname || '';

  return (
    <nav className={styles.navbar} aria-label='Navegación principal'>
      {items.map((link, i) => (
        <Link
          href={link.href}
          key={i}
          className={`${styles.navbarItem} ${
            activePathname === link.href ||
            (link.href !== '/' && activePathname.startsWith(`${link.href}/`))
              ? styles.active
              : ''
          }`}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
};

export default NavigationBar;
