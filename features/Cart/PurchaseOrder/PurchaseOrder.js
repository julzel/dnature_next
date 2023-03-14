import React from "react";

// local imports
// styles
import styles from "./PurchaseOrder.module.scss";

// components
import CurrencyText from "../../../components/Currency";

/*
{
    "items": [
        {
            "id": "5eEfu2xGibqbMTr4GFgvyM",
            "quantity": 2,
            "price": 2000,
            "productName": "Bofé de res deshidratado ",
            "containers": [
                {
                    "description": "1000 gramos",
                    "quantity": 2
                }
            ]
        }
    ],
    "totalItems": 2,
    "total": 4000,
    "subtotal": 4000,
    "tax": 0,
    "discount": 0,
    "client": {
        "id": "",
        "firstName": "",
        "lastName": ""
    }
}
*/

const PurchaseOrder = ({ cart, currentDate }) => {
  console.log(cart);
  return (
    <div className={styles.purchaseOrder}>
      <h1 className={styles.title}>
        Orden de compra: <span>{currentDate}</span>
      </h1>
      {true && (
        <div className={styles.client}>
          <div><span>Cliente:</span>{cart.client?.firstName} {cart.client?.lastName}</div>
          <div><span></span></div>
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
            <td colSpan="4" />
          </tr>
        </tbody>
        <tfoot className={styles.tableFoot}>
          <tr>
            <td colSpan="3">Subtotal</td>
            <td><CurrencyText value={cart.subtotal} /></td>
          </tr>
          <tr>
            <td colSpan="3">Descuento</td>
            <td><CurrencyText value={0.00} /></td>
          </tr>
          <tr>
            <td colSpan="3">Total</td>
            <td><CurrencyText value={cart.total} /></td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default PurchaseOrder;
