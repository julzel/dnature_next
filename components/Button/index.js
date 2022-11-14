import React from 'react'

// local imports

// styles
import styles from './Button.module.scss'

const Button = ({ children, onClick, selected, secondary }) => {
    return (
        <button className={`${styles.button} ${secondary ? styles.secondary : ''} ${selected ? styles.selected : ''}`} onClick={onClick}>
            {children}
        </button>
    )
}
 
export default Button