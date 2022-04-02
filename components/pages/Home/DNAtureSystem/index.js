import React from 'react'
import Image from 'next/image'

// local imports
// styles
import styles from './DNAtureSystem.module.scss'

// images
import ribbon from '../../../../public/marca/orange-ribbon-shadow.svg';

const DNAtureSystem = () => {
    return (
        <section className={styles.dnatureSystem}>
            <h2 className={`title ${styles.title}`}>
                Plan de alimentación completo
            </h2>
            <div className={styles.dnatureSystemContainer}>
                <div className={styles.dnatureSystemItem}>
                    <h3 className={styles.dnatureSystemItemTitle}>
                        <div>
                            <Image src={ribbon} alt='fondo naranja con un icono de huella de perro' />
                        </div>
                        <span className={styles.dnatureSystemItemTitleText}>Calculamos la ración diaria de tu mascota</span>
                    </h3>
                </div>
                <div className={styles.dnatureSystemItem}>
                    <h3 className={styles.dnatureSystemItemTitle}>
                        <div>
                            <Image src={ribbon} alt='fondo naranja con un icono de huella de perro' />
                        </div>
                        <span className={styles.dnatureSystemItemTitleText}>Coordinamos el envío hasta la puerta de tu casa</span>
                    </h3>
                </div>
                <div className={styles.dnatureSystemItem}>
                    <h3 className={styles.dnatureSystemItemTitle}>
                        <div>
                            <Image src={ribbon} alt='fondo naranja con un icono de huella de perro' />
                        </div>
                        <span className={styles.dnatureSystemItemTitleText}>Reenvío automático con la frecuencia de tu
                            preferencia</span>
                    </h3>
                </div>
            </div>
        </section>
    )
}

export default DNAtureSystem
