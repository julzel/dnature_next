import { faMagnifyingGlass, faSliders } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import styles from './HeaderSearch.module.scss';

const HeaderSearch = ({ id }) => (
  <div className={styles.search} role='search'>
    <FontAwesomeIcon className={styles.searchIcon} icon={faMagnifyingGlass} />
    <label className='visually-hidden' htmlFor={id}>
      Buscar productos
    </label>
    <input
      id={id}
      type='search'
      placeholder='Buscar recetas, snacks o ingredientes'
      autoComplete='off'
    />
    <button type='button' aria-label='Opciones de búsqueda'>
      <FontAwesomeIcon icon={faSliders} />
    </button>
  </div>
);

export default HeaderSearch;
