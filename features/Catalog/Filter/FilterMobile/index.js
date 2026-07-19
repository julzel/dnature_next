import React, { useId, useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";

// local imports
// styles
import styles from "./FilterMobile.module.scss";

const FilterMobile = ({ options, selected }) => {
  const [showList, setShowList] = useState(false);
  const optionsId = useId();

  return (
    <div className={styles.filter}>
      <button
        type="button"
        className={styles.filterHeader}
        onClick={() => setShowList((currentValue) => !currentValue)}
        aria-expanded={showList}
        aria-controls={optionsId}
      >
        <span className={styles.icon}
        >
          <FontAwesomeIcon icon={faFilter} />
        </span>
        <span>&nbsp;Filtrar</span>
      </button>
      <ul id={optionsId} className={`${styles.filterList} ${showList ? styles.show : ""}`} hidden={!showList}>
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
