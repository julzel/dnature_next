import { Typography } from '@mui/material';
import Dialog from '../../../components/Dialog';

const CartNotification = ({ onCloseInfoModal }) => {
  return (
    <Dialog type="info" title="Estimados clientes" onClose={onCloseInfoModal}>
      <Typography>
        En DNAture, estamos trabajando para brindarte un mejor servicio. Pronto
        habilitaremos el pago en línea con tarjeta de crédito o débito.
      </Typography>
      <Typography
        sx={{
          fontWeight: 700,
          fontSize: '20px',
          color: 'warning.main',
          textDecoration: 'underline',
        }}
      >
        Mientras, puedes hacer tus pedidos a nuestro{' '}
        <a href="https://wa.me/50671848868">WhatsApp</a> adjuntando la imagen de
        la orden de compra que hemos generado para ti.
      </Typography>
      <Typography component="div">
        Aceptamos pagos por SINPE Móvil o transferencia bancaria. Por favor,
        adjunta el comprobante de pago en el mensaje de WhatsApp. Para más
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
          <a href="https://wa.me/50671848868">+506 7184-8868</a>
        </Typography>
        . ¡Gracias por confiar en DNAture!
      </Typography>
    </Dialog>
  );
};

export default CartNotification;
