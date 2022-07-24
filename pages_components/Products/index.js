import React from 'react'
import { useRouter } from 'next/router'

// local imports
// styles
// import styles from './Home.module.scss'

// components
// import Hero from './Hero'
import Catalog from './Catalog'


const Productos = () => {
    const router = useRouter()
    const { category } = router.query
    
    return (
        <Catalog category={category}/>
    )
}
 
export default Productos