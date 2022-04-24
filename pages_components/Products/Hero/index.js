import React from 'react'

// local imports

// styles
import styles from './Hero.module.scss'

const Benefits = () => {
    return (
        <div className={styles.hero}>
            <h1 className='seo-hidden'>
                Productos para la alimentación natural de tu mascota
            </h1>

            <div className={styles.heroFilter} />
            <div className={styles.heroBackground} />
            <h2 className={styles.heroTitle}>
                Para una
                <br /><span>nutrición</span>
                <br />completa
            </h2>
        </div>
    );
}

export default Benefits