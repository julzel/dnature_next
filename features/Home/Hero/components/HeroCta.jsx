import { ArrowRight } from 'lucide-react';

import Button from '../../../../components/Button';
import styles from './HeroCta.module.scss';

const HeroCta = () => (
  <div className={styles.actions}>
    <Button
      className={styles.primaryAction}
      href="/productos"
      iconEnd={<ArrowRight aria-hidden='true' size={18} strokeWidth={2.5} />}
      size="large"
      variant="primary"
    >
      Explorar productos
    </Button>
  </div>
);

export default HeroCta;
