import React from 'react'
import Image from 'next/image'

// local imports
// data
import benefits from './benefits'

// styles
import styles from './Benefits.module.scss'

// images
import pawIcon from '../../../../public/images/paw.svg'

// components
import AnimationBox from '../../../AnimationBox'

const Benefits = () => {
    return (
        <div className={styles.benefits}>
            <div className={styles.benefitsImage} />
            <h2 className={`title ${styles.title}`}>
                Beneficios
            </h2>
            {/* <AnimationBox animation='fade-in-from-center'> */}
                <div className={styles.benefitsContainer}>
                    <ul>
                        {benefits.map((benefit, i) => (
                            <AnimationBox animation='fade-in-from-left' key={i}>
                            <li key={i}>
                                <span>
                                    <Image src={pawIcon} alt='pawIcon' />
                                </span>
                                {benefit}
                            </li>
                            </AnimationBox>
                        ))}
                    </ul>
                </div>
            {/* </AnimationBox> */}
        </div>
    );
}

export default Benefits