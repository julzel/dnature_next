import { ChevronRight } from 'lucide-react';

import Button from '../../../components/Button';
import styles from './HeroCta.module.scss';

const HeroCta = () => (
  <Button
    className={styles.cta}
    href="/productos"
    iconEnd={
      <span className={styles.arrowBadge}>
        <ChevronRight aria-hidden="true" strokeWidth={3} />
      </span>
    }
    size="large"
    variant="primary"
  >
    Comprar ahora
  </Button>
);

export default HeroCta;
