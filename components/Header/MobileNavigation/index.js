'use client';

import { useEffect, useRef, useState } from 'react';
import { Menu, X } from 'lucide-react';

import DropdownMenu from '../DropdownMenu';
import styles from './MobileNavigation.module.scss';

const MobileNavigation = ({ items }) => {
  const [isOpen, setIsOpen] = useState(false);
  const controlRef = useRef(null);
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
    const handlePointerDown = (event) => {
      if (!controlRef.current?.contains(event.target)) {
        setIsOpen(false);
        requestAnimationFrame(() => {
          const activeElement = document.activeElement;
          if (
            activeElement === document.body ||
            controlRef.current?.contains(activeElement)
          ) {
            triggerRef.current?.focus();
          }
        });
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.addEventListener('pointerdown', handlePointerDown);
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [isOpen]);

  return (
    <div ref={controlRef} className={styles.control}>
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
        {isOpen ? (
          <X aria-hidden='true' size={23} strokeWidth={1.8} />
        ) : (
          <Menu aria-hidden='true' size={23} strokeWidth={1.8} />
        )}
      </button>
    </div>
  );
};

export default MobileNavigation;
