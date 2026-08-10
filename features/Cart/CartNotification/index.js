import { CheckCircle2, Download, MessageCircleMore } from 'lucide-react';

import Button from '../../../components/Button';
import ModalContainer from '../../../components/Modal';
import styles from './CartNotification.module.scss';

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
    <section className={styles.confirmation}>
      <CheckCircle2 aria-hidden='true' className={styles.icon} size={44} />
      <p className={styles.eyebrow}>Resumen preparado</p>
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
        <p className={styles.warning} role='status'>{handoffWarning}</p>
      ) : null}

      <ol className={styles.steps}>
        <li>Abrí WhatsApp con el botón.</li>
        {hasPurchaseArtifact ? (
          <li>Adjuntá manualmente la imagen descargada.</li>
        ) : (
          <li>Revisá el resumen de productos incluido en el mensaje.</li>
        )}
        <li>Enviá el mensaje y esperá la confirmación de DNAture.</li>
      </ol>

      <p className={styles.notice}>
        No realicés ningún pago hasta que confirmemos disponibilidad, monto final,
        modalidad y fecha.
      </p>

      <div className={styles.actions}>
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

      <div className={styles.secondaryActions}>
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
