import React from 'react'
import Image from 'next/image'

// local imports

// styles
import styles from './Benefits.module.scss'

// images
import pawIcon from '../../../../public/images/paw.svg'

const Benefits = () => {
    return (
        <div className={styles.benefits}>
        <h2 className='title'>
            ¿Cómo beneficia una dieta natural a tu mascota?
        </h2>
        <ul>
            <li>
                <span>
                    <Image src={pawIcon} alt='pawIcon' />
                </span>
                Mejora la digestión
            </li>
            <li>
                <span>
                    <Image src={pawIcon} alt='pawIcon' />
                </span>
                Mejora la salud bucal
            </li>
            <li>
                <span>
                    <Image src={pawIcon} alt='pawIcon' />
                </span>
                Pelaje y piel saludables
            </li>
            <li>
                <span>
                    <Image src={pawIcon} alt='pawIcon' />
                </span>
                Reducción de alergias
            </li>
            <li>
                <span>
                    <Image src={pawIcon} alt='pawIcon' />
                </span>
                Facilita el control de peso
            </li>
            <li>
                <span>
                    <Image src={pawIcon} alt='pawIcon' />
                </span>
                Heces más sólidas
            </li>
        </ul>
    </div>
    );
}

export default Benefits