import {
  faArrowRight,
  faBagShopping,
  faMinus,
  faPlus,
  faTrashCan,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Button from '../../components/Button';
import styles from './DesignDemo.module.scss';

export const metadata = {
  title: 'Sistema de diseño',
  robots: { index: false, follow: false },
};

const ButtonExample = ({ label, children }) => (
  <div className={styles.buttonExample}>
    {children}
    <code>{label}</code>
  </div>
);

const DesignDemoPage = () => (
  <section className={styles.demo}>
    <header className={styles.hero}>
      <p className={styles.eyebrow}>DNAture · Sistema de diseño</p>
      <h1>Componentes para decisiones claras.</h1>
      <p>
        Un catálogo vivo de los patrones de interfaz reutilizables. Esta página
        es de referencia visual; los controles no cambian datos.
      </p>
      <div className={styles.heroActions}>
        <Button href='/productos' variant='primary' iconEnd={<FontAwesomeIcon icon={faArrowRight} />}>
          Ver productos
        </Button>
        <Button href='/cart' variant='secondary'>
          Ver carrito
        </Button>
      </div>
    </header>

    <section className={styles.section} aria-labelledby='cta-title'>
      <div className={styles.sectionHeading}>
        <p className={styles.eyebrow}>01 · Calls to action</p>
        <h2 id='cta-title'>Una jerarquía para cada intención</h2>
        <p>El color y el peso visual comunican el resultado de una acción.</p>
      </div>
      <div className={styles.buttonGrid}>
        <ButtonExample label='variant="primary"'>
          <Button variant='primary'>Continuar</Button>
        </ButtonExample>
        <ButtonExample label='variant="secondary"'>
          <Button variant='secondary'>Cancelar</Button>
        </ButtonExample>
        <ButtonExample label='variant="tertiary"'>
          <Button variant='tertiary'>Regresar</Button>
        </ButtonExample>
        <ButtonExample label='variant="accent"'>
          <Button variant='accent'>Empezar</Button>
        </ButtonExample>
        <ButtonExample label='variant="danger"'>
          <Button variant='danger' iconStart={<FontAwesomeIcon icon={faTrashCan} />}>
            Vaciar carrito
          </Button>
        </ButtonExample>
      </div>
    </section>

    <section className={styles.section} aria-labelledby='states-title'>
      <div className={styles.sectionHeading}>
        <p className={styles.eyebrow}>02 · Estados y tamaños</p>
        <h2 id='states-title'>El mismo lenguaje en cada contexto</h2>
      </div>
      <div className={styles.statesGrid}>
        <div className={styles.surface}>
          <h3>Tamaños</h3>
          <div className={styles.stack}>
            <Button size='small'>Pequeño</Button>
            <Button size='medium'>Mediano</Button>
            <Button size='large'>Grande</Button>
          </div>
        </div>
        <div className={styles.surface}>
          <h3>Estados</h3>
          <div className={styles.stack}>
            <Button loading>Generando orden</Button>
            <Button disabled>Continuar</Button>
            <Button href='/productos' disabled>
              Enlace no disponible
            </Button>
          </div>
        </div>
        <div className={styles.surface}>
          <h3>Iconos</h3>
          <div className={styles.iconRow}>
            <Button
              variant='secondary'
              iconOnly
              aria-label='Agregar producto'
              iconStart={<FontAwesomeIcon icon={faPlus} />}
            />
            <Button
              variant='tertiary'
              iconOnly
              aria-label='Cerrar diálogo'
              iconStart={<FontAwesomeIcon icon={faXmark} />}
            />
            <Button
              variant='danger'
              iconOnly
              aria-label='Eliminar producto'
              iconStart={<FontAwesomeIcon icon={faTrashCan} />}
            />
          </div>
        </div>
      </div>
    </section>

    <section className={styles.section} aria-labelledby='commerce-title'>
      <div className={styles.sectionHeading}>
        <p className={styles.eyebrow}>03 · Comercio</p>
        <h2 id='commerce-title'>Producto y carrito</h2>
      </div>
      <div className={styles.commerceGrid}>
        <article className={styles.productCard}>
          <div className={styles.productVisual} aria-hidden='true'>
            <span>DN</span>
          </div>
          <p className={styles.productType}>Receta completa</p>
          <h3>Pollo y caballo</h3>
          <p className={styles.price}>₡5,000 <span>· 1 kg</span></p>
          <label htmlFor='presentation'>Presentación</label>
          <select id='presentation' defaultValue='1kg'>
            <option value='500g'>500 g</option>
            <option value='1kg'>1 kg</option>
            <option value='2kg'>2 kg</option>
          </select>
          <Button fullWidth iconStart={<FontAwesomeIcon icon={faBagShopping} />}>
            Agregar al carrito
          </Button>
        </article>

        <article className={styles.cartCard}>
          <div className={styles.cartHeading}>
            <div>
              <p className={styles.eyebrow}>Tu pedido</p>
              <h3>Carrito</h3>
            </div>
            <span className={styles.cartCount}>2</span>
          </div>
          <div className={styles.cartItem}>
            <div>
              <strong>Pollo y caballo</strong>
              <span>₡5,000 · 1 kg</span>
            </div>
            <div className={styles.quantity} aria-label='Cantidad: 2'>
              <button type='button' aria-label='Restar una unidad'>
                <FontAwesomeIcon icon={faMinus} />
              </button>
              <span>2</span>
              <button type='button' aria-label='Agregar una unidad'>
                <FontAwesomeIcon icon={faPlus} />
              </button>
            </div>
          </div>
          <div className={styles.total}>
            <span>Total</span>
            <strong>₡10,000</strong>
          </div>
          <div className={styles.cartActions}>
            <Button variant='tertiary'>Regresar</Button>
            <Button>Continuar</Button>
          </div>
        </article>
      </div>
    </section>

    <section className={styles.section} aria-labelledby='field-title'>
      <div className={styles.sectionHeading}>
        <p className={styles.eyebrow}>04 · Formularios</p>
        <h2 id='field-title'>Campos tranquilos, foco evidente</h2>
      </div>
      <div className={styles.fieldSurface}>
        <label htmlFor='name'>Nombre</label>
        <input id='name' placeholder='Nombre de tu mascota' />
        <label htmlFor='email'>Correo electrónico</label>
        <input id='email' type='email' placeholder='nombre@correo.com' />
        <Button fullWidth>Guardar datos</Button>
      </div>
    </section>
  </section>
);

export default DesignDemoPage;
