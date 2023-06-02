import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";

// local imports
// styles
import styles from "./FilterMobile.module.scss";

const FilterMobile = ({ options, selected }) => {
  const [showList, setShowList] = useState(false);
  const [selectedOption, setSelectedOption] = useState(selected);

  useEffect(() => {
    if (selected.id !== selectedOption.id) {
      setSelectedOption(selected);
      setShowList(false);
    }
  }, [selected, selectedOption.id]); 

  return (
    <div className={styles.filter}>
      <button
        className={styles.filterHeader}
        onClick={() => setShowList(!showList)}
      >
        <span className={styles.icon}
        >
          <FontAwesomeIcon icon={faFilter} />
        </span>
        <span>&nbsp;Filtrar</span>
      </button>
      <ul className={`${styles.filterList} ${showList ? styles.show : ""}`}>
        {options.map((item) => {
          return (
            <li
              key={`filter-by-${item.id}`}
              className={selected.id === item.id ? styles.active : ""}
            >
              <Link
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
