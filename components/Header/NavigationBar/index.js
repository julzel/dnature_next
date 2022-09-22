import React from 'react'
import Link from 'next/link'
import { useRouter } from "next/router";

// styles
import styles from './NavigationBar.module.scss'


const NavigationBar = ({ items, switchColor }) => {
    const router = useRouter();

    return (
        <nav className={styles.navbar}>
            {items.map((link, i) => (
                <Link href={link.href} passHref key={i}>
                    <span className={`${styles.navbarItem} ${switchColor ? styles.dark : ''} ${router.pathname == link.href ? styles.active : ''}`}>
                        {link.label}
                    </span>
                </Link>
            ))}
        </nav>
    )
}

export default NavigationBar