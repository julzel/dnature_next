import React, { useEffect } from "react";

// local imports
// styles
import styles from "./Home.module.scss";

// components
import Hero from "./Hero";
import Banner from "./Banner";
import Welcome from "./Welcome";
import Products from "./Products";
import Contact from "./Contact";
import DNAtureSystem from "./DNAtureSystem";
import OurCostumers from "./OurCostumers";
import Appointments from "./Appointments";

const Home = ({ categories }) => {

  return (
    <div className={styles.home}>
      <Hero />
      <Banner />
      <Welcome />
      <Products categories={categories} />
      <DNAtureSystem />
      <Appointments />
      <OurCostumers />
      <Contact />
    </div>
  );
};

export default Home;
