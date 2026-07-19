import ModalContainer from '../../../components/Modal';
import MessageBox from '../../../components/MessageBox';

const CartNotification = ({ onCloseInfoModal}) => {
  return (
    <ModalContainer
      ariaLabel="Información del pedido"
      closeModal={onCloseInfoModal}
    >
        <MessageBox type="info" onClose={onCloseInfoModal}>
          <h3>Estimados clientes</h3>
          <div>
            <p>
            En DNAture, estamos trabajando para brindarte un mejor servicio.
            Pronto habilitaremos el pago en línea con tarjeta de crédito o
            débito.
            </p>
            <p>
              <strong>
              Mientras, puedes hacer tus pedidos a nuestro{' '}
              <a href="https://wa.me/50671848868">WhatsApp</a> adjuntando la
              imagen de la orden de compra que hemos generado para ti.
              </strong>
            </p>
          </div>
          <p>
            Aceptamos pagos por SINPE Móvil o transferencia bancaria. Por favor,
            adjuntar el comprobante de pago en el mensaje de WhatsApp. Para más
            información contáctanos en WhatsApp:{' '}
            <strong>
              <a href="https://wa.me/50671848868">+506 7184-8868</a>
            </strong>. ¡Gracias por confiar en DNAture!
          </p>
        </MessageBox>
      </ModalContainer>
  );
}
 
export default CartNotification;
