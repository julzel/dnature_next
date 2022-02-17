import React from 'react'
import Image from 'next/image'

import AspecRatioBox from '../../AspectRatioBox'
import bannerImg from '../../../public/slider_01/base_orange_patita-01.svg'
import acidosGrasos from '../../../public/slider_01/fish_amarillo-01.svg'
import blueCircle from '../../../public/slider_01/circulo_azul.png'
import yellowCircle from '../../../public/slider_01/circulo_amarillo.png'
import styles from './SlideNutrition.module.scss'
import ResponsiveImage from '../../ResponsiveImage'

const aspectRatio = 750 / 1920 * 100;

const SlideNutrition = () => {
    return (
        <AspecRatioBox aspectRatio={aspectRatio}>
            <div className={styles.slideNutrition}>
                <div className={styles.container}>
                    <div className={styles.header}>
                        <h2>
                            Ácidos <br />
                            <span>Grasos</span><br />
                            Escenciales.
                        </h2>
                        <div className={styles.images}>
                            <div className={styles.fish}>
                                <ResponsiveImage src={acidosGrasos} alt='Acidos Grasos' />
                            </div>
                            <ResponsiveImage src={blueCircle} alt='Omega 3' />
                            <ResponsiveImage src={yellowCircle} alt='Mezcla de carne cruda' />
                        </div>
                    </div>
                </div>
                <div className={styles.subheader}>
                    <ResponsiveImage src={bannerImg} alt='banner' />
                    <p>
                        Ayudan a la prevención de de enfermedades cardiovasculares,
                        aumenta el brillo en el pelaje, y proteje la piel.
                    </p>
                    <div className={styles.actions}>
                        <div className={styles.start}>
                            Comenzar ahora
                        </div>
                        <div className={styles.nutrition}>
                            <span>+</span>
                            Nutrición
                        </div>
                    </div>
                </div>
            </div>
        </AspecRatioBox>
    )
}

export default SlideNutrition