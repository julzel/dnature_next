import { faCirclePlus, faCircleMinus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '../../../components/Icon';

const QuickAdd = ({ itemsInCart, removeOneItemFromCart, addItemToCart }) => {
  return (
    <div>
      <button type="button" aria-label="Quitar una unidad" disabled={itemsInCart === 0} onClick={removeOneItemFromCart}>
        <FontAwesomeIcon icon={faCircleMinus} />
      </button>
      <span>{itemsInCart || 0}</span>
      <button type="button" aria-label="Agregar una unidad" onClick={addItemToCart}>
        <FontAwesomeIcon icon={faCirclePlus} />
      </button>
    </div>
  );
};

export default QuickAdd;
