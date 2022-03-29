import React from 'react'
import Image from 'next/image'

// local imports
// styles
import styles from './Welcome.module.scss'

// images
import rawFoodPlate from '../../../../public/images/our-ingredients-plate.png'

const Welcome = () => {
    return (
        <div className={styles.welcome}>
            <div className={styles.sectionImage}>
                <Image
                    src={rawFoodPlate}
                    alt='Plato comida natural para mascotas'
                />
            </div>
            <div className={styles.sectionContent}>
                <h2 className={`title ${styles.title}`}>
                    Alimentación natural
                </h2>

                <div className={styles.welcomeSection}>
                    <h3 className={styles.subtitle}>
                        ¿En qué consiste?
                    </h3>
                    <p className={styles.paragraph}>
                        Los perros son <span className={styles.paragraphHighlight}>caninos facultativos</span>,
                        quiere decir que su alimentación debe basarse en productos de origen animal, pero de 
                        requerirlo pueden sobrellevar una dieta con alimentos de origen vegetal.
                    </p>
                    {/* <p className={styles.paragraph}>
                        Por ello la mayor parte de los nutrientes (80%) debe provenir de
                        la carne, preferiblemente <span className={styles.paragraphHighlight}>cruda</span>,
                        tal cual la consumían sus antepasados salvajes. Esto porque a pesar de los cambios
                        que ha implicado su domesticación, su fisiología básica ha cambiado poco.
                    </p>
                    <p className={styles.paragraph}>
                        A pesar de eso, una alimentación basada únicamente en carne no va a
                        satisfacer todas las necesidades nutricionales de tu mascota. Es por
                        eso que adicionalmente se requieren <span className={styles.paragraphHighlight}>complementar y balancear</span>
                        con las vitaminas, minerales y ácidos grasos correspondientes.
                    </p> */}
                </div>

                <div className={styles.welcomeSection}>
                    <h3 className={styles.subtitle}>
                        Alimentación DNAture
                    </h3>
                    <p className={styles.paragraph}>
                        Se trata de una metodología de nutrición acorde a las
                        necesidades reales de tu mascota, según sus características
                        genéticas y fisiológicas (*).
                    </p>
                    <p className={styles.paragraph}>
                        Son recetas con ingredientes con muy
                        <span className={styles.narrow}>
                            poco o nulo procesamiento, libre de preservantes, o aditivos
                            artificiales; y que contienen el balance ideal y sinérgico
                            entre los nutrientes que la conforman.
                        </span>
                    </p>
                    <p className={styles.paragraph}>
                        <span className={styles.paragraphSmall}>
                            (*) De acuerdo con lineamientos de la FEDIAF
                            (European Pet Food Industry Federation). Más información:&nbsp;
                            <a href='https://fediaf.org/self-regulation/nutrition.html#guidelines'>
                                www.fediaf.org
                            </a>
                        </span>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Welcome