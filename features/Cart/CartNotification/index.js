import { Typography } from '@mui/material';
import ModalContainer from '../../../components/Modal';
import MessageBox from '../../../components/MessageBox';

const CartNotification = ({ onCloseInfoModal}) => {
  return (
    <ModalContainer closeModal={onCloseInfoModal}>
        <MessageBox type="info" onClose={onCloseInfoModal}>
          <h3>Estimados clientes</h3>
          <p>
            En DNAture, estamos trabajando para brindarte un mejor servicio.
            Pronto habilitaremos el pago en línea con tarjeta de crédito o
            débito.{' '}
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: '20px',
                color: 'warning.main',
                textDecoration: 'underline',
              }}
            >
              Mientras, puedes hacer tus pedidos a nuestro{' '}
              <a href="https://wa.me/50671732328">WhatsApp</a> adjuntando la
              imagen de la orden de compra que hemos generado para ti.
            </Typography>
          </p>
          <p>
            Aceptamos pagos por SINPE Móvil o transferencia bancaria. Por favor,
            adjuntar el comprobante de pago en el mensaje de WhatsApp. Para más
            información contáctanos en WhatsApp:{' '}
            <Typography
              component="span"
              sx={{
                fontWeight: 700,
                fontSize: '20px',
                color: 'warning.main',
                textDecoration: 'underline',
              }}
            >
              <a href="https://wa.me/50671732328">+506 7173-2328</a>
            </Typography>. ¡Gracias por confiar en DNAture!
          </p>
        </MessageBox>
      </ModalContainer>
  );
}
 
export default CartNotification;