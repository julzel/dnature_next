import React, { useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

// local imports
// styles
import styles from "./FilterMobile.module.scss";

const FilterMobile = ({ options, selected }) => {
  const [showList, setShowList] = useState(false);

  return (
    <div className={styles.filter}>
      <div
        className={styles.filterHeader}
        role="button"
        tabIndex="0"
        onClick={() => setShowList(!showList)}
      >
        <span>Filtrar&nbsp;</span>
        <span
          style={{
            transform: `rotate(${showList ? "180" : "0"}deg)`,
          }}
          className={styles.icon}
        >
          <FontAwesomeIcon icon={faChevronDown} />
        </span>
      </div>
      <ul className={`${styles.filterList} ${showList ? styles.show : ""}`}>
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
};

export default FilterMobile;
