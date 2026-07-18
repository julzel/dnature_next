import React, { useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";

// local imports
// styles
import styles from "./FilterMobile.module.scss";

const FilterMobile = ({ options, selected }) => {
  const [showList, setShowList] = useState(false);

  return (
    <div className={styles.filter}>
      <button
        type="button"
        className={styles.filterHeader}
        onClick={() => setShowList(!showList)}
        aria-expanded={showList}
        aria-controls="product-filter-options"
      >
        <span className={styles.icon}
        >
          <FontAwesomeIcon icon={faFilter} />
        </span>
        <span>&nbsp;Filtrar</span>
      </button>
      <ul id="product-filter-options" className={`${styles.filterList} ${showList ? styles.show : ""}`} hidden={!showList}>
        {options.map((item) => {
          return (
            <li
              key={`filter-by-${item.id}`}
              className={selected.id === item.id ? styles.active : ""}
            >
              <Link
                href={`/productos?category=${item.id}`}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default FilterMobile;
