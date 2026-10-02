import { arrowRightSymbol, bagShoppingSymbol, minusSymbol, plusSymbol, trashCanSymbol, xmarkSymbol } from '../../components/Icon';
import { TextIcon } from '../../components/Icon';

import Button from '../../components/Button';

export const metadata = {
  title: 'Sistema de diseño',
  robots: { index: false, follow: false },
};

const ButtonExample = ({ label, children }) => (
  <div>
    {children}
    <code>{label}</code>
  </div>
);

const DesignDemoPage = () => (
  <section>
    <header>
      <p>DNAture · Sistema de diseño</p>
      <h1>Componentes para decisiones claras.</h1>
      <p>
        Un catálogo vivo de los patrones de interfaz reutilizables. Esta página
        es de referencia visual; los controles no cambian datos.
      </p>
      <div>
        <Button href='/productos' variant='primary' iconEnd={<TextIcon symbol={arrowRightSymbol} />}>
          Ver productos
        </Button>
        <Button href='/checkout' variant='secondary'>
          Ver carrito
        </Button>
      </div>
    </header>

    <section aria-labelledby='cta-title'>
      <div>
        <p>01 · Calls to action</p>
        <h2 id='cta-title'>Una jerarquía para cada intención</h2>
        <p>El color y el peso visual comunican el resultado de una acción.</p>
      </div>
      <div>
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
          <Button variant='danger' iconStart={<TextIcon symbol={trashCanSymbol} />}>
            Vaciar carrito
          </Button>
        </ButtonExample>
      </div>
    </section>

    <section aria-labelledby='states-title'>
      <div>
        <p>02 · Estados y tamaños</p>
        <h2 id='states-title'>El mismo lenguaje en cada contexto</h2>
      </div>
      <div>
        <div>
          <h3>Tamaños</h3>
          <div>
            <Button size='small'>Pequeño</Button>
            <Button size='medium'>Mediano</Button>
            <Button size='large'>Grande</Button>
          </div>
        </div>
        <div>
          <h3>Estados</h3>
          <div>
            <Button loading>Generando orden</Button>
            <Button disabled>Continuar</Button>
            <Button href='/productos' disabled>
              Enlace no disponible
            </Button>
          </div>
        </div>
        <div>
          <h3>Iconos</h3>
          <div>
            <Button
              variant='secondary'
              iconOnly
              aria-label='Agregar producto'
              iconStart={<TextIcon symbol={plusSymbol} />}
            />
            <Button
              variant='tertiary'
              iconOnly
              aria-label='Cerrar diálogo'
              iconStart={<TextIcon symbol={xmarkSymbol} />}
            />
            <Button
              variant='danger'
              iconOnly
              aria-label='Eliminar producto'
              iconStart={<TextIcon symbol={trashCanSymbol} />}
            />
          </div>
        </div>
      </div>
    </section>

    <section aria-labelledby='commerce-title'>
      <div>
        <p>03 · Comercio</p>
        <h2 id='commerce-title'>Producto y carrito</h2>
      </div>
      <div>
        <article>
          <div aria-hidden='true'>
            <span>DN</span>
          </div>
          <p>Receta completa</p>
          <h3>Pollo y caballo</h3>
          <p>₡5,000 <span>· 1 kg</span></p>
          <label htmlFor='presentation'>Presentación</label>
          <select id='presentation' defaultValue='1kg'>
            <option value='500g'>500 g</option>
            <option value='1kg'>1 kg</option>
            <option value='2kg'>2 kg</option>
          </select>
          <Button fullWidth iconStart={<TextIcon symbol={bagShoppingSymbol} />}>
            Agregar al carrito
          </Button>
        </article>

        <article>
          <div>
            <div>
              <p>Tu pedido</p>
              <h3>Carrito</h3>
            </div>
            <span>2</span>
          </div>
          <div>
            <div>
              <strong>Pollo y caballo</strong>
              <span>₡5,000 · 1 kg</span>
            </div>
            <div aria-label='Cantidad: 2'>
              <button type='button' aria-label='Restar una unidad'>
                <TextIcon symbol={minusSymbol} />
              </button>
              <span>2</span>
              <button type='button' aria-label='Agregar una unidad'>
                <TextIcon symbol={plusSymbol} />
              </button>
            </div>
          </div>
          <div>
            <span>Total</span>
            <strong>₡10,000</strong>
          </div>
          <div>
            <Button variant='tertiary'>Regresar</Button>
            <Button>Continuar</Button>
          </div>
        </article>
      </div>
    </section>

    <section aria-labelledby='field-title'>
      <div>
        <p>04 · Formularios</p>
        <h2 id='field-title'>Campos tranquilos, foco evidente</h2>
      </div>
      <div>
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
