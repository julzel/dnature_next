import React from 'react'
import Image from 'next/image'

// local imports
// styles
import styles from './Footer.module.scss'

// images
import logoBlack from '../../public/images/dnature-logo-black.svg'

const Footer = () => {
    const date = new Date().getFullYear()
    return (
        <footer className={styles.footer}>
            
            <p><span><Image src={logoBlack} alt='DNAture Logo' /></span></p>
            <p>
                Todos los derechos reservados.
            </p>
            <p>Costa Rica, {date}</p>
        </footer>
    );
}
 
export default Footer