import React, { useState, useEffect } from 'react';

// local imports
// styles
import styles from './Banner.module.scss';

// data
import phrases from './phrases';

const PHRASE_INTERVAL = 7000; // 7 seconds

const Banner = () => {
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentPhraseIndex((prevIndex) => {
        // Increment the current phrase index, wrapping around to 0 if necessary
        return (prevIndex + 1) % phrases.length;
      });
    }, PHRASE_INTERVAL); // 5 second interval

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div className={styles.banner}>
      <p>{phrases[currentPhraseIndex]}</p>
    </div>
  );
};

export default Banner;
