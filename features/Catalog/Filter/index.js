import Link from 'next/link';

import styles from './Filter.module.scss';

const Filter = ({ options, selected }) => (
  <nav className={styles.filter} aria-label='Categorías de productos'>
    <div className={styles.chipRail}>
      {options.map((item) => {
        const isSelected = selected.id === item.id;
        const href = item.id === 'all' ? '/productos' : `/productos?category=${item.id}`;

        return (
          <Link
            key={`filter-by-${item.id}`}
            href={href}
            className={`${styles.chip} ${isSelected ? styles.active : ''}`}
            aria-current={isSelected ? 'page' : undefined}
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  </nav>
);

export default Filter;
