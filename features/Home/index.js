import React, { useEffect } from 'react';

// local imports
// styles
import styles from './Home.module.scss';

// components
import Hero from './Hero';
import Banner from './Banner';
import Welcome from './Welcome';
import Benefits from './Benefits';
import Products from './Products';
import Contact from './Contact';
import DNAtureSystem from './DNAtureSystem';
import OurCostumers from './OurCostumers';

const Home = () => {
  function callApi() {
    fetch('https://dnature-be.herokuapp.com/', { method: 'GET' })
      .then((data) => data.json())
      .then((json) => console.log(JSON.stringify(json)));
  }

  useEffect(() => {
    // callApi();
  }, []);

  return (
    <div className={styles.home}>
      <Hero />
      <Banner />
      <Welcome />
      <Products />
      {/* <Benefits /> */}
      <DNAtureSystem />
      <OurCostumers />
      <Contact />
    </div>
  );
};

export default Home;
