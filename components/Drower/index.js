import Modal from '../Modal';

const Drower = ({ children, close }) => (
  <Modal
    ariaLabel='Calculadora de porciones'
    closeLabel='Cerrar calculadora'
    closeModal={close}
  >
    {children}
  </Modal>
);

export default Drower;
