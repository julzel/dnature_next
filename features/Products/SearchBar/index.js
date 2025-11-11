import React from 'react';
import Image from 'next/image';
import { Search } from 'lucide-react';

// styles
import styles from './SearchBar.module.scss';

const SearchBar = ({ query, onChange, suggestions, onSuggestionSelect }) => {
  const handleChange = (event) => {
    onChange(event.target.value);
  };

  const handleSuggestionClick = (event, product) => {
    event.preventDefault();
    onSuggestionSelect(product);
  };

  const shouldDisplayResults = query.trim().length > 0;

  return (
    <div className={styles.searchBar}>
      <label className={styles.label} htmlFor="product-search">
        Buscar productos
      </label>
      <div className={styles.inputWrapper}>
        <span className={styles.icon}>
          <Search size={20} />
        </span>
        <input
          id="product-search"
          type="search"
          className={styles.input}
          placeholder="Buscar productos"
          autoComplete="off"
          autoCorrect="off"
          spellCheck="false"
          value={query}
          onChange={handleChange}
        />
      </div>
      {shouldDisplayResults && (
        <div className={styles.results}>
          {suggestions.length ? (
            <ul className={styles.resultsList}>
              {suggestions.map((product, idx) => {
                const thumbnail = product.images?.[0];
                const productKey = [product.sys?.id, product.urlSlug, idx]
                  .filter(Boolean)
                  .join('-');

                return (
                  <li key={productKey} className={styles.resultItem}>
                    <button
                      type="button"
                      className={styles.suggestionButton}
                      onClick={(event) => handleSuggestionClick(event, product)}
                    >
                      <span className={styles.thumbnail}>
                        {thumbnail ? (
                          <Image
                            src={thumbnail.url}
                            alt={thumbnail.title || product.productName}
                            width={48}
                            height={48}
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
                    </button>
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
