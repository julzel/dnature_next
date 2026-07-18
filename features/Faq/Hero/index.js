import React from 'react'

// local imports

// styles
import styles from './Hero.module.scss'

const Benefits = () => {
    return (
        <div className={styles.hero}>
            <div className={styles.heroFilter} />
            <div className={styles.heroBackground} />
            <h1 className={styles.heroTitle}>
                Preguntas
                <br /><span>Frecuentes</span>
            </h1>
        </div>
    );
}

export default Benefits
