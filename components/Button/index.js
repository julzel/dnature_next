import React from 'react';

const Button = ({ onClick, label, icon, disabled}) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
        >
            {icon && <span>{icon}</span>}
            {label && <span>{label}</span>}
        </button>
    );
}
 
export default Button;