'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NavigationBar = ({ items }) => {
  const pathname = usePathname();
  const activePathname = pathname || '';

  return (
    <nav aria-label='Navegación principal'>
      <ul>
        {items.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              aria-current={
                activePathname === link.href ||
                (link.href !== '/' && activePathname.startsWith(`${link.href}/`))
                  ? 'page'
                  : undefined
              }
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default NavigationBar;
