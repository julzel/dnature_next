import { faCirclePlus, faCircleMinus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import styles from './QuickAdd.module.scss';

const QuickAdd = ({ itemsInCart, removeOneItemFromCart, addItemToCart }) => {
  return (
    <div className={styles.quickAdd}>
      <button disabled={itemsInCart === 0} className={styles.light} onClick={removeOneItemFromCart}>
        <FontAwesomeIcon icon={faCircleMinus} />
      </button>
      <span className={styles.badge}>{itemsInCart || 0}</span>
      <button onClick={addItemToCart}>
        <FontAwesomeIcon icon={faCirclePlus} />
      </button>
    </div>
  );
};

export default QuickAdd;
