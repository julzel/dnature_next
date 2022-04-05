import React from 'react'

// local imports
// styles
import styles from './Button.module.scss'

const Button = ({ onClick, label, icon, disabled }) => {

    const handleOnClick = () => onClick && onClick()

    return (
        <button
            className={styles.button}
            onClick={handleOnClick}
            disabled={disabled}
        >
            {icon && <span>{icon}</span>}
            {label && <span>{label}</span>}
        </button>
    )
}
 
export default Button