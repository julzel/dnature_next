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
  const options = getMenuDefaultOptions(type);

  const handleClose = (option) => {
    if (option.label === 'Editar') editItem();
    if (option.label === 'Borrar') deleteItem();
    setOpen(false);
  };

  return (
    <div className={styles.optionsMenu}>
      <IconButton
        aria-label={ariaLabel}
        aria-controls={open ? menuId : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="menu"
        onClick={() => setOpen((isOpen) => !isOpen)}
      >
        <MoreVertIcon />
      </IconButton>
      {open && (
        <div className={styles.menu} id={menuId} role="menu">
          {options.map((option) => (
            <button
              key={option.label}
              type="button"
              role="menuitem"
              onClick={() => handleClose(option)}
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
