import React from 'react'

// local imports
import Hero from './Hero'
import Diet from './Diet'
import Benefits from './Benefits'
import Products from './Products'
import Map from './Map'

// styles
import styles from './Home.module.scss'


const Home = () => {
    return (
        <div className={styles.home}>
            <Hero />
            <Diet />
            <Benefits />
            <Products />
            <Map />
        </div>
    )
}
 
export default Home