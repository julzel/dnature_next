import Link from 'next/link'
import React from 'react'
import { faStore, faStar, faWeight, faCircleQuestion } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

// local imports
import styles from './DropdownMenu.module.scss'

const linkItems = [
    {
        href:'/',
        icon: faStar,
        label: 'inicio'
    },
    {
        href:'/productos',
        icon: faStore,
        label: 'productos'
    },
    {
        href:'/preguntas-frecuentes',
        icon: faCircleQuestion,
        label: 'preguntas frecuentes'
    },
    {
        href:'/calculadora',
        icon: faWeight,
        label: 'calcular porción'
    }
]

const DropdownMenu = ({ items, show }) => {
    return (
        <div
            className={styles.dropdown}
            style={{ 
                transform: show ? 'translateX(0)' : 'translateX(-100%)',
                // opacity: show ? '1' : '0'
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
                            <FontAwesomeIcon icon={link.icon} size='xs' />
                            <span>{link.label}</span>
                        </span>
                    </Link>
                </li>
                ))}
            </ul>
        </div>
    )
}
 
export default DropdownMenu