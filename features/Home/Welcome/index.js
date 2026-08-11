import Image from 'next/image';

import styles from './Welcome.module.scss';
import items from './items';

const Welcome = () => {
  return (
    <section className={styles.welcome} aria-labelledby='welcome-title'>
      <div className={styles.heading}>
        <p className={styles.eyebrow}>Alimentación DNAture</p>
        <h2 id='welcome-title'>Comida real, preparada con intención</h2>
        <p>
          Una propuesta de alimentación natural que prioriza ingredientes
          reconocibles, equilibrio y acompañamiento para cada mascota.
        </p>
      </div>

      <ul className={styles.items}>
        {items.map((item) => (
          <li key={item.title} className={styles.item}>
            <div className={styles.iconFrame}>
              <Image
                src={item.icon}
                alt=''
                aria-hidden='true'
                width={item.width}
                height={item.height}
                className={item.smallIcon ? styles.smallIcon : styles.icon}
              />
            </div>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Welcome;
