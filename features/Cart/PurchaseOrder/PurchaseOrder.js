import React from 'react';

// local imports
// styles
import styles from './PurchaseOrder.module.scss';

// components
import CurrencyText from '../../../components/Currency';

const PurchaseOrder = ({ cart, generatePurchaseOrderId }) => {
  let date = new Date(cart.date);
  let options = { day: '2-digit', month: '2-digit', year: 'numeric' };
  let formattedDate = date.toLocaleDateString('es-419', options);
  return (
    <div className={styles.purchaseOrder}>
      {cart.client?.email && (
        <h1 className={styles.title}>
          Orden de compra:{' '}
          <span>{generatePurchaseOrderId(cart.client.email)}</span>
        </h1>
      )}
      {true && (
        <div className={styles.client}>
          <div>
            <span>Fecha:</span>
            {formattedDate}
          </div>
          <div>
            <span>Cliente:</span>
            {cart.client?.firstName} {cart.client?.lastName}
          </div>
          <div>
            <span>Correo:</span>
            {cart.client?.email}
          </div>
          <div>
            <span>Teléfono:</span>
            {cart.client?.contactPhoneNumber}
          </div>
          <div>
            <span>Dirección</span>
            {cart.client.address.direccion}. {cart.client.address.canton},{' '}
            {cart.client.address.provincia}
          </div>
        </div>
      )}
      <table className={styles.table}>
        <thead className={styles.tableHead}>
          <tr>
            <th>Unds</th>
            <th>Producto</th>
            <th>Precio</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody className={styles.tableBody}>
          {cart.items.map((item) => (
            <tr key={item.id}>
              <td>{item.quantity}</td>
              <td>{item.productName}</td>
              <td>
                <CurrencyText value={item.price} />
              </td>
              <td>
                <CurrencyText value={item.price * item.quantity} />
              </td>
            </tr>
          ))}
          <tr className={styles.empty}>
            <td colSpan='4' />
          </tr>
        </tbody>
        <tfoot className={styles.tableFoot}>
          <tr>
            <td colSpan='3'>Subtotal</td>
            <td>
              <CurrencyText value={cart.subtotal} />
            </td>
          </tr>
          <tr>
            <td colSpan='3'>Descuento</td>
            <td>
              <CurrencyText value={0.0} />
            </td>
          </tr>
          <tr>
            <td colSpan='3'>Envío*</td>
            <td>
              <CurrencyText value={3000.0} />
            </td>
          </tr>
          <tr>
            <td colSpan='3'>Total</td>
            <td>
              <CurrencyText value={cart.total + 3000.0} />
            </td>
          </tr>
        </tfoot>
      </table>
      <div className={styles.footNote}>
        <p>
          <span>*</span> Precio aplica para la Gran Área Metropolitana.
        </p>
        <p>
          <span>Atención</span>: Fecha de entrega por coordinar.
        </p>
      </div>
    </div>
  );
};

export default PurchaseOrder;
