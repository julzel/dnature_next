import React from "react";
import Link from "next/link";

// local imports
// styles
import styles from "./FilterDesktop.module.scss";

const FilterDesktop = ({ options, selected }) => (
  <div className={styles.filter}>
    <ul className={styles.filterList}>
      {options.map((item) => {
        return (
          <li
            key={`filter-by-${item.id}`}
            className={selected.id === item.id ? styles.active : ""}
          >
            <Link
              key={`filter-by-${item.id}`}
              href={`/productos?category=${item.id}`}
              passHref
            >
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  </div>
);

export default FilterDesktop;
