import React from "react";

// local imports
// styles
import styles from "./FilterDesktop.module.scss";

const FilterDesktop = ({ options, selected, onOptionSelect }) => (
  <div className={styles.filter}>
    <ul className={styles.filterList}>
      {options.map((item) => {
        return (
          <li
            role="button"
            key={`filter-by-${item.id}`}
            tabIndex="0"
            onClick={() => onOptionSelect(item.id)}
            className={selected === item.id ? styles.active : ""}
          >
            {item.label}
          </li>
        );
      })}
    </ul>
  </div>
);

export default FilterDesktop;
