import React from 'react';

// local imports
// styles
import styles from './PurchaseOrder.module.scss';

// components
import CurrencyText from '../../../components/Currency';
import { PAYMENT_METHOD_LABELS } from '../model/checkout';

const PurchaseOrder = ({ cart }) => {
  const date = cart.purchaseOrderDate || cart.date;
  const formattedDate = date
    ? new Intl.DateTimeFormat('es-419', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        timeZone: 'America/Costa_Rica',
      }).format(new Date(date))
    : '';
  return (
    <div className={styles.purchaseOrder}>
      {cart.purchaseOrderId && (
        <h1 className={styles.title}>
          Solicitud DNAture:{' '}
          <span>{cart.purchaseOrderId}</span>
        </h1>
      )}
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
          <span>Modalidad:</span>
          {cart.wantsDelivery ? 'Entrega a domicilio' : 'Retiro coordinado'}
        </div>
        <div>
          <span>Pago preferido:</span>
          {PAYMENT_METHOD_LABELS[cart.paymentMethod] || 'Por coordinar'}
        </div>
        {cart.wantsDelivery ? (
          <div>
            <span>Dirección:</span>
            {[
              cart.client.address.direccion,
              cart.client.address.distrito,
              cart.client.address.canton,
              cart.client.address.provincia,
            ].filter(Boolean).join(', ')}
          </div>
        ) : null}
        {cart.client.address.notasEntrega ? (
          <div>
            <span>Indicaciones de entrega:</span>
            {cart.client.address.notasEntrega}
          </div>
        ) : null}
        {cart.orderNotes ? (
          <div>
            <span>Indicaciones del pedido:</span>
            {cart.orderNotes}
          </div>
        ) : null}
      </div>
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
            <td colSpan='3'>IVA (13%)</td>
            <td>
              <CurrencyText value={cart.tax} />
            </td>
          </tr>
          <tr>
            <td colSpan='3'>{cart.wantsDelivery ? 'Entrega estimada' : 'Retiro'}</td>
            <td>
              {cart.wantsDelivery ? <CurrencyText value={cart.deliveryFee} /> : 'Sin costo'}
            </td>
          </tr>
          <tr>
            <td colSpan='3'>Total estimado</td>
            <td>
              <CurrencyText value={cart.total} />
            </td>
          </tr>
        </tfoot>
      </table>
      <div className={styles.footNote}>
        {cart.wantsDelivery && (
          <p>
            <span>Entrega:</span> Cobertura y tarifa sujetas a confirmación dentro de la Gran Área Metropolitana.
          </p>
        )}
        <p>
          <span>Importante:</span> Esta solicitud no reserva inventario ni confirma el pedido. DNAture confirmará disponibilidad, monto, pago y entrega por WhatsApp.
        </p>
      </div>
    </div>
  );
};

export default PurchaseOrder;
