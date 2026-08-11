import Image from 'next/image';
import Link from 'next/link';
import { ArrowDown, MessageCircleMore } from 'lucide-react';

import { WHATSAPP_URL } from '../../../constants/contact';
import styles from './Hero.module.scss';

const Hero = () => (
  <section className={styles.hero} aria-labelledby="faq-title">
    <div className={styles.shell}>
      <div className={styles.copy}>
        <nav className={styles.breadcrumbs} aria-label="Migas de pan">
          <ol>
            <li><Link href="/">Inicio</Link></li>
            <li aria-current="page">Preguntas frecuentes</li>
          </ol>
        </nav>
        <p className={styles.eyebrow}>Centro de ayuda</p>
        <h1 id="faq-title">Respuestas para cuidarles mejor</h1>
        <p className={styles.intro}>
          Encontrá información clara sobre alimentación natural, productos,
          conservación, pedidos y cuidados para perros y gatos.
        </p>

        <div className={styles.actions}>
          <a className={styles.primaryAction} href="#preguntas">
            Explorar preguntas
            <ArrowDown aria-hidden="true" size={18} />
          </a>
          <a
            className={styles.secondaryAction}
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircleMore aria-hidden="true" size={18} />
            Consultar al equipo
          </a>
        </div>

        <p className={styles.scopeNote}>
          La orientación general no sustituye la valoración de un médico
          veterinario cuando existe una condición de salud.
        </p>
      </div>

      <figure className={styles.visual}>
        <Image
          className={styles.image}
          src="/faq/faq.jpg"
          alt="Perro sosteniendo un hueso carnoso al aire libre"
          fill
          priority
          sizes="(max-width: 767px) 100vw, 44vw"
        />
        <figcaption>
          <span>¿No encontrás tu respuesta?</span>
          Escribinos y te ayudamos a elegir el siguiente paso.
        </figcaption>
      </figure>
    </div>
  </section>
);

export default Hero;
