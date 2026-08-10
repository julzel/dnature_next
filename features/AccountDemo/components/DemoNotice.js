import { FlaskConical } from 'lucide-react';

import { accountStyles as styles } from '../../Account';

const DemoNotice = ({ compact = false }) => (
  <aside
    className={`${styles.demoNotice} ${compact ? styles.demoNoticeCompact : ''}`}
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
