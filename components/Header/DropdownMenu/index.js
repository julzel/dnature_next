import Link from 'next/link'
import React from 'react'
import { faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

// local imports
import styles from './DropdownMenu.module.scss'

const linkItems = [
    {
        href:'/',
        label: 'inicio'
    },
    {
        href:'/productos',
        label: 'productos'
    },
    {
        href:'/preguntas-frecuentes',
        label: 'preguntas frecuentes'
    },
    {
        href:'/calculadora',
        label: 'calcular porción'
    }
]

const DropdownMenu = ({ items, show }) => {
    return (
        <div
            className={styles.dropdown}
            style={{ 
                transform: show ? 'translateX(0)' : 'translateX(-100%)'
            }}
        >
            <ul className={styles.dropdownMenu}>
                {linkItems.map((link, i) => (
                    <li
                        key={i}
                        className={styles.item}
                    >
                    <Link href={link.href} passHref>
                        <span className={styles.itemLink}>
                            <span>{link.label}</span>
                            <FontAwesomeIcon icon={faChevronRight} size='m' />
                        </span>
                    </Link>
                </li>
                ))}
            </ul>
        </div>
    )
}
 
export default DropdownMenu