import Image from '../../../components/Image';
import Link from 'next/link';
import { ArrowDown, MessageCircleMore } from "../../../components/Icon";

import { WHATSAPP_URL } from '../../../constants/contact';

const Hero = () => (
  <section className='faq-hero section-shell' aria-labelledby="faq-title">
    <div>
      <div>
        <nav aria-label="Migas de pan">
          <ol>
            <li><Link href="/">Inicio</Link></li>
            <li aria-current="page">Preguntas frecuentes</li>
          </ol>
        </nav>
        <p>Centro de ayuda</p>
        <h1 id="faq-title">Respuestas para cuidarles mejor</h1>
        <p>
          Encontrá información clara sobre alimentación natural, productos,
          conservación, pedidos y cuidados para perros y gatos.
        </p>

        <div>
          <a href="#preguntas">
            Explorar preguntas
            <ArrowDown aria-hidden="true" size={18} />
          </a>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircleMore aria-hidden="true" size={18} />
            Consultar al equipo
          </a>
        </div>

        <p>
          La orientación general no sustituye la valoración de un médico
          veterinario cuando existe una condición de salud.
        </p>
      </div>

      <figure>
        <Image
          src="/faq/faq.jpg"
          width={300}
          height={375}
          alt="Perro sosteniendo un hueso carnoso al aire libre"
          loading='eager'
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
