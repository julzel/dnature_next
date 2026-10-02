import { FlaskConical } from "../../../components/Icon";

const DemoNotice = () => (
  <aside
    aria-label='Aviso de demostración'
  >
    <FlaskConical aria-hidden='true' size={20} />
    <div>
      <strong>Propuesta interactiva</strong>
      <span>
        Los accesos, perfiles y carritos se simulan en este dispositivo. No se
        envían datos a DNAture.
      </span>
    </div>
  </aside>
);

export default DemoNotice;
