import React from 'react'

// local imports
import Hero from './Hero'
import Welcome from './Welcome'
import Benefits from './Benefits'
import Products from './Products'
import Contact from './Contact'

// styles
import styles from './Home.module.scss'
import DNAtureSystem from './DNAtureSystem'


const Home = () => {
    return (
        <div className={styles.home}>
            <Hero />
            <Welcome />
            <Benefits />
            <Products />
            <DNAtureSystem />
            <Contact />
        </div>
    )
}
 
export default Home