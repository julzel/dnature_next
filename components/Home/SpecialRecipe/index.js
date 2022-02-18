import React from 'react'

import ResponsiveImage from '../../ResponsiveImage'
import perritos from '../../../public/images/tirita_perritos_receta_esp-01.svg'
import plato from '../../../public/images/our-ingredients-plate.png'
import styles from './SpecialRecipe.module.scss'

const SpecialRecipe = () => {
    return (
        <div className={styles.specialRecipe}>
            <div className={styles.background}>
                <div className={styles.plate}>
                    <ResponsiveImage
                        src={plato}
                        alt='Plato preparado de comida cruda con variedad de ingredientes naturales'
                    />
                </div>
            </div>
            <div className={styles.content}>
                <div className={styles.header}>
                    <h3>Una receta especial</h3>
                    <h4>para mascotas especiales</h4>
                    <div className={styles.dogsStrip}>
                        <ResponsiveImage src={perritos} alt='variedad de razas de perritos en caricatura' />
                    </div>
                    <p className={styles.text}>
                        Todos los ingredientes de nuestras recetas cumplen un propósito especial.
                        ¿Necesitas mejorar la salud o el brillo de pelo de tu perro o gato? Tenemos
                        mezclas preparadas, proteínas y suplementos específicos para cada necesidad
                        de tu mascota.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default SpecialRecipe