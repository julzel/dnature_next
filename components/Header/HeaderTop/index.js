import React from 'react'

// local imports
import styles from './HeaderTop.module.scss'

const dateOptions = {
    weekday: 'short',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
};

const getTodaysDate = () => {
    const todaysDay = new Date().toLocaleDateString('es-MX', dateOptions)
    return todaysDay.charAt(0).toUpperCase() + todaysDay.slice(1);
}

const HeaderTop = () => {
    return (
        <div className={styles.headerTop}>
            <div className={styles.container}>
                {getTodaysDate()}
            </div>
        </div>
    )
}
 
export default HeaderTop