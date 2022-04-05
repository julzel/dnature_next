import React from 'react'
import Image from 'next/image'

// local imports
// styles
import styles from './DNAtureSystem.module.scss'

// images
import ribbon from '../../../../public/marca/fish-orange-ribbon-shadow.svg';

// data
import SystemItems from './system-items'

// components
import AnimationBox from '../../../AnimationBox';

const DNAtureSystem = () => {
    return (
        <section className={styles.dnatureSystem}>
            <div className={styles.dnatureSystemImage} />
            <h2 className={`title ${styles.title}`}>
                Plan completo DNAture
            </h2>
            <div className={styles.dnatureSystemContainer}>
                {SystemItems.map((item, i) => (
                    <AnimationBox animation='fade-in-from-top' key={i}>
                        <div className={styles.dnatureSystemItem}>
                            <h3 className={styles.dnatureSystemItemTitle}>
                                <div>
                                    <Image src={ribbon} alt='fondo naranja con un icono de huella de perro' />
                                </div>
                                <span className={styles.dnatureSystemItemTitleText}>{item}</span>
                            </h3>
                        </div>
                    </AnimationBox>
                ))}
            </div>
        </section>
    )
}

export default DNAtureSystem
