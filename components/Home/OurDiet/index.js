import React from 'react'

import ResponsiveImage from '../../ResponsiveImage'
import banner from '../../../public/images/titular_scrll_1-01.svg'
import meat from '../../../public/images/our-diet-meat.svg'
import mix from '../../../public/images/our-diet-mix.svg'
import balance from '../../../public/images/our-diet-balance.svg'
import styles from './OurDiet.module.scss'

const OurDiet = () => {
    return (
        <section className={styles.ourDiet}>
            <h2 className={styles.title}>
                <span className='seo-hidden'>Nutrición balanceada natural</span>
                <ResponsiveImage src={banner} alt='Perro salchicha comiendo alimento natural' />
                <span className={styles.subtitle}>¿Qué tipo de dieta utilizamos?</span>
            </h2>
            <div className={styles.columns}>
                <div className={styles.column}>
                    <div className={styles.headerImage}>
                        <ResponsiveImage src={meat} alt='dibujo de carne' />
                    </div>
                    <p>
                        Utilizamos una dieta acorde a las necesidades de los <span>carnívoros facultativos y carnívoros 
                        estrictos</span>.
                    </p>
                </div>
                <div className={styles.column}>
                    <div className={styles.headerImage}>
                        <ResponsiveImage src={mix} alt='ingredientes siendo mezclados' />
                    </div>
                    <p>
                        Todos nuestros ingredientes cumplen con un propósito y función por lo que no nos adherimos a
                        dietas pre estipuladas, sino que nos enfocamos en <span>promover el equilibrio holístico que
                        exite entre nutrición, salud y el bienestar físico, social y emocional de tu mascota</span>.
                    </p>
                </div>
                <div className={styles.column}>
                    <div className={styles.headerImage}>
                        <ResponsiveImage src={balance} alt='una dieta equilibrada' />
                    </div>
                    <p>
                        Libre de almidones, preservantes; cruda, balanceada y provee los nutrientes esenciales para un
                        correcto mantenimiento de su salud.
                    </p>
                </div>
            </div>
        </section>
    )
}
 
export default OurDiet