import { TextIcon } from '../../../components/Icon';
import { instagramSymbol } from '../../../components/Icon';
import {
  ArrowUpRight,
  Clock3,
  Mail,
  MapPin,
  MessageCircleMore,
  Navigation,
} from "../../../components/Icon";

import {
  DNATURE_SUPPORT_HOURS,
  DNATURE_SUPPORT_RESPONSE,
  DNATURE_WHATSAPP_DISPLAY,
  DNATURE_WHATSAPP_PHONE,
} from '../../../constants/contact';
import { STORE_GOOGLE_MAPS_URL } from '../../../constants/store';
import Map from './Map';

const contactChannels = [
  {
    id: 'whatsapp',
    href: `https://wa.me/${DNATURE_WHATSAPP_PHONE}`,
    eyebrow: 'Respuesta más rápida',
    title: 'Escríbenos por WhatsApp',
    detail: DNATURE_WHATSAPP_DISPLAY,
    icon: MessageCircleMore,
    featured: true,
  },
  {
    id: 'instagram',
    href: 'https://www.instagram.com/dnaturecr',
    eyebrow: 'Ideas y novedades',
    title: 'Síguenos en Instagram',
    detail: '@dnaturecr',
    brandIcon: instagramSymbol,
  },
  {
    id: 'email',
    href: 'mailto:info@dnaturefood.com',
    eyebrow: 'Consultas por correo',
    title: 'Escríbenos por email',
    detail: 'info@dnaturefood.com',
    icon: Mail,
    external: false,
  },
];

const Contact = () => (
  <section className='home-contact section-shell' aria-labelledby='contact-title'>
    <div>
      <header>
        <p>Estamos para ayudarte</p>
        <h2 id='contact-title'>Cuéntanos de tu mascota.</h2>
        <p>
          Te ayudamos a elegir productos, resolver dudas y coordinar tu pedido
          de una forma sencilla y cercana.
        </p>
        <ul aria-label='Horario de atención'>
          <li>
            <Clock3 aria-hidden='true' size={16} />
            {DNATURE_SUPPORT_HOURS}
          </li>
          <li>{DNATURE_SUPPORT_RESPONSE}</li>
        </ul>
      </header>

      <div>
        <div>
          <div>
            {contactChannels.map((channel) => {
              const Icon = channel.icon;
              const opensNewTab = channel.external !== false;

              return (
                <a
                  href={channel.href}
                  key={channel.id}
                  {...(opensNewTab
                    ? { target: '_blank', rel: 'noopener noreferrer' }
                    : {})}
                >
                  <span aria-hidden='true'>
                    {channel.brandIcon ? (
                      <TextIcon symbol={channel.brandIcon} />
                    ) : (
                      <Icon size={22} strokeWidth={1.9} />
                    )}
                  </span>
                  <span>
                    <small>{channel.eyebrow}</small>
                    <strong>{channel.title}</strong>
                    <span>{channel.detail}</span>
                  </span>
                  <ArrowUpRight
                    aria-hidden='true'
                    size={18}
                  />
                </a>
              );
            })}
          </div>

          <div>
            <span aria-hidden='true'>DNA</span>
            <div>
              <strong>Atención personalizada</strong>
              <p>
                Contanos qué necesitás y te orientamos para encontrar la mejor
                opción disponible.
              </p>
            </div>
          </div>
        </div>

        <article aria-labelledby='location-title'>
          <div>
            <Map />
          </div>
          <div>
            <span aria-hidden='true'>
              <MapPin size={22} strokeWidth={1.9} />
            </span>
            <div>
              <p>Colima de Tibás · San José</p>
              <h3 id='location-title'>También podés pasar por nuestro local</h3>
              <span>
                Coordiná el horario antes de visitarnos para que podamos tener
                tu pedido listo.
              </span>
            </div>
            <a
              href={STORE_GOOGLE_MAPS_URL}
              target='_blank'
              rel='noopener noreferrer'
            >
              Abrir ubicación
              <Navigation aria-hidden='true' size={17} />
            </a>
          </div>
        </article>
      </div>
    </div>
  </section>
);

export default Contact;
