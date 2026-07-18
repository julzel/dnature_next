'use client';

import React from 'react';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import styles from './OptionsMenu.module.scss';

const getMenuDefaultOptions = (type) => {
  const defaultOptions = {
    'simple-edit': [{
      icon: <EditIcon />,
      label: 'Editar',
    }, {
      icon: <DeleteIcon />,
      label: 'Borrar',
    }]
  };
  return defaultOptions[type];
};

const OptionsMenu = ({
  type = 'simple-edit',
  editItem,
  deleteItem,
  ariaLabel = 'Opciones',
}) => {
  const [open, setOpen] = React.useState(false);
  const menuId = React.useId();
  const triggerRef = React.useRef(null);
  const itemRefs = React.useRef([]);
  const options = getMenuDefaultOptions(type);

  React.useEffect(() => {
    if (open) {
      itemRefs.current[0]?.focus();
    }
  }, [open]);

  const closeMenu = ({ restoreFocus = true } = {}) => {
    setOpen(false);
    if (restoreFocus) {
      triggerRef.current?.focus();
    }
  };

  const handleSelect = (option) => {
    if (option.label === 'Editar') editItem();
    if (option.label === 'Borrar') deleteItem();
    closeMenu();
  };

  const handleTriggerKeyDown = (event) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      setOpen(true);
    }
  };

  const handleMenuKeyDown = (event) => {
    const currentIndex = itemRefs.current.indexOf(document.activeElement);
    let nextIndex = currentIndex;

    if (event.key === 'Escape') {
      event.preventDefault();
      closeMenu();
      return;
    }

    if (event.key === 'Tab') {
      closeMenu({ restoreFocus: false });
      return;
    }

    if (event.key === 'ArrowDown') {
      nextIndex = (currentIndex + 1) % options.length;
    } else if (event.key === 'ArrowUp') {
      nextIndex = (currentIndex - 1 + options.length) % options.length;
    } else if (event.key === 'Home') {
      nextIndex = 0;
    } else if (event.key === 'End') {
      nextIndex = options.length - 1;
    } else {
      return;
    }

    event.preventDefault();
    itemRefs.current[nextIndex]?.focus();
  };

  return (
    <div className={styles.optionsMenu}>
      <IconButton
        ref={triggerRef}
        aria-label={ariaLabel}
        aria-controls={open ? menuId : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="menu"
        onClick={() => setOpen((isOpen) => !isOpen)}
        onKeyDown={handleTriggerKeyDown}
      >
        <MoreVertIcon />
      </IconButton>
      {open && (
        <div
          className={styles.menu}
          id={menuId}
          role="menu"
          onKeyDown={handleMenuKeyDown}
        >
          {options.map((option, index) => (
            <button
              ref={(element) => {
                itemRefs.current[index] = element;
              }}
              key={option.label}
              type="button"
              role="menuitem"
              tabIndex={-1}
              onClick={() => handleSelect(option)}
            >
              <span>{option.label}</span>
              {option.icon}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default OptionsMenu;
