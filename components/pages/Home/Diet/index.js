import React from 'react'

// local imports
// components
import RibbonTitle from '../../../RibbonTitle';

// styles
import styles from './Diet.module.scss'

const Diet = () => {
    return (
        <div className={styles.diet}>
            <RibbonTitle type='blue'>
                <h2 className='title'>
                    Dieta <span>DNAture</span>
                </h2>
            </RibbonTitle>

            <p className={styles.dietParagraph}>
                Se trata de una metodología de nutrición acorde a las
                necesidades reales de tu mascota, según sus características
                genéticas y fisiológicas (*).
            </p>
            <p className={styles.dietParagraph}>
                Son recetas con ingredientes con muy poco o nulo procesamiento,
                libre de preservantes, o aditivos artificiales; y que contienen
                el balance ideal y sinérgico entre los nutrientes que la conforman.
            </p>
            <p className={styles.dietParagraph}>
                <span className={styles.dietParagraphSmall}>
                    (*) De acuerdo con lineamientos de la FEDIAF
                    (European Pet Food Industry Federation). Más información:&nbsp;
                    <a href='https://fediaf.org/self-regulation/nutrition.html#guidelines'>
                        www.fediaf.org
                    </a>
                </span>
            </p>
        </div>
    );
}

export default Diet