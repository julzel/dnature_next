import React from 'react'

// local imports

// styles
import styles from './Hero.module.scss'

const Benefits = () => {
    return (
        <div className={styles.hero}>
            <h1 className='seo-hidden'>
                Alimentación natural y dieta cruda para mascotas
            </h1>

            <div className={styles.heroBackgroundColor} />
            <div className={styles.heroBackgroundImage} />
            <div className={styles.heroFilter} />
            <h2 className={styles.heroTitle}>
                La forma
                <br /><span>natural</span>
                <br />de alimentar
                <br />a tu mascota
            </h2>
        </div>
    );
}

export default Benefits