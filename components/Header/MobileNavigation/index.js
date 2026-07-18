'use client';

import { useEffect, useRef, useState } from 'react';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import DropdownMenu from '../DropdownMenu';
import styles from './MobileNavigation.module.scss';

const MobileNavigation = ({ items }) => {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  return (
    <>
      {isOpen && (
        <DropdownMenu
          items={items}
          onNavigate={() => setIsOpen(false)}
        />
      )}
      <button
        ref={triggerRef}
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
