import React from 'react'

import data from './data'
import ResponsiveImage from '../../ResponsiveImage'
import proteinsRibbon from '../../../public/images/titular_proteinas_red-01.svg'
import suplementsRibbon from '../../../public/images/titular_suplementos_green-01.svg'
import styles from './OurIngredients.module.scss'

const OurIngredients = () => {

    return (
        <div className={styles.ourIngredients}>
            <div className={styles.proteins}>
                <div>
                    <h4>
                        <span className='seo-hidden'>Proteínas</span>
                        <ResponsiveImage src={proteinsRibbon} alt='título de proteinas' />
                    </h4>
                    <ul>
                        {data.proteins.map((protein, i) => (
                            <li key={i}>
                                <span className={styles.icon}>
                                    <ResponsiveImage
                                        src={protein.icon}
                                        alt={protein.label}
                                    />
                                </span>
                                <span className={styles.label}>
                                    {protein.label}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className={styles.suplements}>
                <div>
                    <h4>
                        <span className='seo-hidden'>Suplementos</span>
                        <ResponsiveImage src={suplementsRibbon} alt='título de suplementos' />
                    </h4>
                    <ul>
                        {data.suplements.map((suplement, k) => (
                                <li key={k}>
                                    <span className={styles.icon}>
                                        <ResponsiveImage
                                            src={suplement.icon}
                                            alt={suplement.label}
                                        />
                                    </span>
                                    <span className={styles.label}>
                                        {suplement.label}
                                    </span>
                                </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}
 
export default OurIngredients