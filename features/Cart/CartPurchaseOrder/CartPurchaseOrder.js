import React from "react";

// local imports

// components
import PurchaseOrderContainer from "../PurchaseOrder";
import Button from "../../../components/Button";

const CartPurchaseOrder = ({
  onPurchaseCancel,
  onPurchaseConfirm,
  onPurchaseEdit,
  purchaseError,
  isCapturingPurchase,
}) => {
  return (
    <div className='order-review'>
      <div>
        <p>Paso 3 de 3</p>
        <h2>Revisá la solicitud</h2>
        <span>
          Todavía no se ha enviado. Verificá los datos antes de preparar el
          archivo para WhatsApp.
        </span>
      </div>
      <PurchaseOrderContainer />
      <div>
        <Button
          variant="secondary"
          onClick={onPurchaseEdit}
          disabled={isCapturingPurchase}
        >
          Editar datos
        </Button>
        <Button variant="primary" onClick={onPurchaseConfirm} disabled={isCapturingPurchase} loading={isCapturingPurchase}>
          {isCapturingPurchase ? 'Generando…' : 'Preparar para WhatsApp'}
        </Button>
      </div>
      <Button
        variant='tertiary'
        onClick={onPurchaseCancel}
        disabled={isCapturingPurchase}
      >
        Volver al carrito
      </Button>
      {purchaseError && <p role="alert">{purchaseError}</p>}
    </div>
  );
};

export default CartPurchaseOrder;
