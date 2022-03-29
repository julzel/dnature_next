import React from 'react'

// local imports
import Hero from './Hero'
import Welcome from './Welcome'
import Diet from './Diet'
import Benefits from './Benefits'
import Products from './Products'
import Contact from './Contact'

// styles
import styles from './Home.module.scss'


const Home = () => {
    return (
        <div className={styles.home}>
            <Hero />
            {/* <Welcome /> */}
            <Diet />
            <Benefits />
            <Products />
            <Contact />
        </div>
    )
}
 
export default Home