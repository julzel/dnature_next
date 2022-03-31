import React from 'react'
import Image from 'next/image'

// local imports
// components
import AnimationBox from '../../../AnimationBox'

// styles
import styles from './Welcome.module.scss'

// images
import rawFoodPlate from '../../../../public/images/our-ingredients-plate.png'

// data
import items from './items'

const Welcome = () => {
    return (
        <div className={styles.welcome}>
            <div className={styles.welcomeContent}>
                <h2 className={`title ${styles.title}`}>
                    Alimentación DNAture
                </h2>

                <div className={styles.welcomeIntro}>
                    <p>
                        Nuestra gama de recetas, snacks y suplementos, ha sido seleccionada con el
                        objetivo de brindar la nutrición ideal para tu mascota, de acuerdo a su
                        fisiología y su genética.
                    </p>
                </div>

                <div className={styles.welcomeItems}>
                    <ul>
                        {items.map((item, i) => {
                            const animation = i % 2 === 0 ? 'fade-in-from-left' : 'fade-in-from-right'
                            return (
                                <li key={i} className={styles.welcomeItemsItem}>
                                    <AnimationBox animation={animation}>
                                        <div
                                            className={styles.welcomeItemsImage}
                                            style={{
                                                width: item.smallIcon ? '65px' : ''
                                            }}
                                        >
                                            <Image src={item.icon} alt={item.title} />
                                        </div>
                                        <h4 className={styles.welcomeItemsTitle}>
                                            {item.title}
                                        </h4>
                                        <p className={styles.welcomeItemsText}>
                                            {item.text}
                                        </p>
                                    </AnimationBox>
                                </li>
                            )
                        })}
                    </ul>
                </div>

                <div className={styles.welcomeQuote}>
                    <blockquote>
                        <span>&ldquo;</span>La calidad de vida de nuestras mascotas <span>depende
                        enormemente de la comida</span> que les damos. Las recetas de DNAture han
                        sido formuladas para <span>mejorar y preservar esa calidad de vida</span>
                        .<span>&rdquo;</span>
                    </blockquote>
                </div>

                {/* <div className={styles.welcomeSection}>
                    <h3 className={styles.subtitle}>
                        ¿En qué consiste?
                    </h3>
                    <p className={styles.paragraph}>
                        Los perros son <span className={styles.paragraphHighlight}>caninos facultativos</span>,
                        quiere decir que su alimentación debe basarse en productos de origen animal, pero de 
                        requerirlo pueden sobrellevar una dieta con alimentos de origen vegetal.
                    </p>
                    <p className={styles.paragraph}>
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
                    </p>
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
                    <div className={styles.sectionImage} style={{ float: 'right' }}>
                        <Image
                            src={rawFoodPlate}
                            alt='Plato comida natural para mascotas'
                        />
                    </div>
                    <p className={styles.paragraph} style={{ width: '50%' }}>
                        Son recetas con ingredientes con muy
                        poco o nulo procesamiento, libre de preservantes, o aditivos
                        artificiales; y que contienen el balance ideal y sinérgico
                        entre los nutrientes que la conforman.
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
                </div> */}
            </div>
        </div>
    )
}

export default Welcome