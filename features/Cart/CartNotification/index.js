import { CheckCircle2, Download, MessageCircleMore } from "../../../components/Icon";

import Button from '../../../components/Button';
import ModalContainer from '../../../components/Modal';
import {
  DNATURE_SUPPORT_HOURS,
  DNATURE_SUPPORT_RESPONSE,
} from '../../../constants/contact';

const CartNotification = ({
  cart,
  onCloseInfoModal,
  onDownloadAgain,
  onStartAnotherOrder,
  whatsappUrl,
  handoffWarning,
  hasPurchaseArtifact,
  returnFocusRef,
}) => (
  <ModalContainer
    ariaLabel='Solicitud lista para enviar'
    closeModal={onCloseInfoModal}
    returnFocusRef={returnFocusRef}
  >
    <section className='order-notification'>
      <CheckCircle2 aria-hidden='true' size={44} />
      <p>Resumen preparado</p>
      <h2>Tu solicitud está lista para enviar</h2>
      {hasPurchaseArtifact ? (
        <p>
          Descargamos el archivo{' '}
          <strong>solicitud-{cart.purchaseOrderId}.png</strong> en este dispositivo.
          Todavía no se ha enviado ni confirmado el pedido.
        </p>
      ) : (
        <p>
          El pedido todavía no se ha enviado ni confirmado. El mensaje de
          WhatsApp incluye un resumen de los productos para que podás continuar.
        </p>
      )}

      {handoffWarning ? (
        <p role='status'>{handoffWarning}</p>
      ) : null}

      <ol>
        <li>Abrí WhatsApp con el botón.</li>
        {hasPurchaseArtifact ? (
          <li>Adjuntá manualmente la imagen descargada.</li>
        ) : (
          <li>Revisá el resumen de productos incluido en el mensaje.</li>
        )}
        <li>Enviá el mensaje y esperá la confirmación de DNAture.</li>
      </ol>

      <p>
        No realicés ningún pago hasta que confirmemos disponibilidad, monto final,
        modalidad y fecha.
      </p>
      <p>
        Podés escribirnos 24/7. {DNATURE_SUPPORT_HOURS}{' '}
        {DNATURE_SUPPORT_RESPONSE}
      </p>

      <div>
        <Button
          as='a'
          href={whatsappUrl}
          target='_blank'
          rel='noopener noreferrer'
          iconStart={<MessageCircleMore aria-hidden='true' size={19} />}
          fullWidth
        >
          Continuar por WhatsApp
        </Button>
        {hasPurchaseArtifact ? (
          <Button
            variant='secondary'
            iconStart={<Download aria-hidden='true' size={18} />}
            onClick={onDownloadAgain}
            fullWidth
          >
            Descargar imagen otra vez
          </Button>
        ) : null}
      </div>

      <div>
        <Button variant='tertiary' onClick={onCloseInfoModal}>
          Cerrar y conservar el carrito
        </Button>
        <Button href='/productos' variant='tertiary' onClick={onStartAnotherOrder}>
          Empezar otra solicitud
        </Button>
      </div>
    </section>
  </ModalContainer>
);

export default CartNotification;
