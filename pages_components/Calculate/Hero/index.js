import React from 'react'

// local imports

// styles
import styles from './Hero.module.scss'

const Benefits = () => {
    return (
        <div className={styles.hero}>
            <h1 className='seo-hidden'>
                Calcular la porción diaria de tu mascota
            </h1>

            <div className={styles.heroFilter} />
            <div className={styles.heroBackground} />
            <h2 className={styles.heroTitle}>
                La ración
                <br /><span>ideal</span>
                <br />para cada etapa
                <br />de su vida
            </h2>
        </div>
    );
}

export default Benefits