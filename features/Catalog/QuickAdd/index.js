import { circlePlusSymbol, circleMinusSymbol } from '../../../components/Icon';
import { TextIcon } from '../../../components/Icon';

const QuickAdd = ({ itemsInCart, removeOneItemFromCart, addItemToCart }) => {
  return (
    <div>
      <button type="button" aria-label="Quitar una unidad" disabled={itemsInCart === 0} onClick={removeOneItemFromCart}>
        <TextIcon symbol={circleMinusSymbol} />
      </button>
      <span>{itemsInCart || 0}</span>
      <button type="button" aria-label="Agregar una unidad" onClick={addItemToCart}>
        <TextIcon symbol={circlePlusSymbol} />
      </button>
    </div>
  );
};

export default QuickAdd;
