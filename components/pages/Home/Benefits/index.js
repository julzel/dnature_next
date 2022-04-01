import React from 'react'
import Image from 'next/image'

// local imports
// data
import benefits from './benefits'

// styles
import styles from './Benefits.module.scss'

// images
import pawIcon from '../../../../public/images/paw.svg'

const Benefits = () => {
    return (
        <div className={styles.benefits}>
            <div className={styles.benefitsContainer}>
                <h2 className={`title ${styles.title}`}>
                    Beneficios
                </h2>
                <ul>
                    {benefits.map((benefit, i) => (
                        <li key={i}>
                            <span>
                                <Image src={pawIcon} alt='pawIcon' />
                            </span>
                            {benefit}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default Benefits