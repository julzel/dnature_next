import React, { useState, useEffect } from 'react';

// local imports
// styles
import styles from './Banner.module.scss';

// data
import phrases from './phrases';

const PHRASE_INTERVAL = 5000; // 7 seconds

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
      {phrases.map((phrase, index) => {
        return (
          <p
            key={phrase}
            className={index === currentPhraseIndex ? styles.active : ''}
          >
            {phrase}
          </p>
        );
      })}
    </div>
  );
};

export default Banner;
