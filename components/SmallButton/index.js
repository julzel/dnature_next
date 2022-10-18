import React from 'react'

// local imports
// styles
import styles from './SmallButton.module.scss'

const SmallButton = ({ onClick, label, icon, disabled, backgroundColor }) => {

    const handleOnClick = () => onClick && onClick()

    return (
        <button
            className={styles.button}
            onClick={handleOnClick}
            disabled={disabled}
            style={{ backgroundColor: backgroundColor ? backgroundColor : ''}}
        >
            {icon && <span>{icon}</span>}
            {label && <span>{label}</span>}
        </button>
    )
}
 
export default SmallButton