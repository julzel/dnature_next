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

const Home = ({ categories }) => {

  return (
    <div className={styles.home}>
      <Hero />
      <Banner />
      <Welcome />
      <Products categories={categories} />
      <DNAtureSystem />
      <OurCostumers />
      <Contact />
    </div>
  );
};

export default Home;
