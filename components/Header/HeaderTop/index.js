import React, { useEffect, useState } from 'react'

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
    const [todaysDate, setTodaysDate] = useState(null);

    useEffect(() => {
        setTodaysDate(getTodaysDate())
    }, [])

    return (
        <div className={styles.headerTop}>
            <div className={styles.container}>
                {todaysDate}.
            </div>
        </div>
    )
}
 
export default HeaderTop