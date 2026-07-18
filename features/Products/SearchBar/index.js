import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

// styles
import styles from "./SearchBar.module.scss";
import { getProductPath } from '../../../util/product-url';

const SearchBar = ({ query, onChange, suggestions }) => {
  const inputId = React.useId();
  const resultsId = React.useId();
  const handleChange = (event) => {
    onChange(event.target.value);
  };

  const shouldDisplayResults = query.trim().length > 0;

  return (
    <div className={styles.searchBar}>
      <label className={styles.label} htmlFor={inputId}>
        Buscar productos
      </label>
      <div className={styles.inputWrapper}>
        <span className={styles.icon}>
          <FontAwesomeIcon icon={faSearch} />
        </span>
        <input
          id={inputId}
          type="search"
          className={styles.input}
          placeholder="Buscar productos"
          autoComplete="off"
          autoCorrect="off"
          spellCheck="false"
          value={query}
          onChange={handleChange}
          aria-controls={shouldDisplayResults ? resultsId : undefined}
        />
      </div>
      {shouldDisplayResults && (
        <div
          id={resultsId}
          className={styles.results}
          role="region"
          aria-label="Resultados de búsqueda"
          aria-live="polite"
        >
          {suggestions.length ? (
            <ul className={styles.resultsList}>
              {suggestions.map((product, idx) => {
                const thumbnail = product.images?.[0];
                const productKey = [product.sys?.id, product.urlSlug, idx].filter(Boolean).join('-');
                const productPath = getProductPath(product.urlSlug);

                if (!productPath) {
                  return null;
                }

                return (
                  <li key={productKey} className={styles.resultItem}>
                    <Link
                      href={productPath}
                      className={styles.suggestionButton}
                    >
                      <span className={styles.thumbnail}>
                        {thumbnail ? (
                          <Image
                            src={thumbnail.url}
                            alt={thumbnail.title || product.productName}
                            width={48}
                            height={48}
                            sizes="48px"
                            style={{ objectFit: 'cover' }}
                          />
                        ) : (
                          <span className={styles.thumbnailFallback}>
                            {product.productName.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </span>
                      <span className={styles.productName}>
                        {product.productName}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className={styles.emptyState}>No se encontraron productos.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
