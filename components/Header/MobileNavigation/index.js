'use client';

import { useState } from 'react';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import DropdownMenu from '../DropdownMenu';
import styles from './MobileNavigation.module.scss';

const MobileNavigation = ({ items }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {isOpen && <DropdownMenu items={items} />}
      <button
        type="button"
        className={styles.menuButton}
        onClick={() => setIsOpen((currentValue) => !currentValue)}
        aria-expanded={isOpen}
        aria-controls="mobile-navigation"
        aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
      >
        <FontAwesomeIcon icon={faBars} size="lg" />
      </button>
    </>
  );
};

export default MobileNavigation;
