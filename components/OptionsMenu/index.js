import React from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

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

const OptionsMenu = ({ type = 'simple-edit', editItem, deleteItem }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const options = getMenuDefaultOptions(type);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (option) => {
    if (option.label === 'Editar') editItem();
    if (option.label === 'Borrar') deleteItem();
    setAnchorEl(null);
  };

  return (
    <div>
      <IconButton
        aria-label="more"
        id="long-button"
        aria-controls={open ? 'menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        {options.map((option) => (
          <MenuItem key={option} onClick={() => handleClose(option)}>
            {option.label} {option.icon}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}

export default OptionsMenu;