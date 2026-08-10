import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram } from '@fortawesome/free-brands-svg-icons';
import {
  ArrowUpRight,
  Clock3,
  Mail,
  MapPin,
  MessageCircleMore,
  Navigation,
} from 'lucide-react';

import {
  DNATURE_SUPPORT_HOURS,
  DNATURE_SUPPORT_RESPONSE,
  DNATURE_WHATSAPP_DISPLAY,
  DNATURE_WHATSAPP_PHONE,
} from '../../../constants/contact';
import { STORE_GOOGLE_MAPS_URL } from '../../../constants/store';
import Map from './Map';
import styles from './Contact.module.scss';

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
    brandIcon: faInstagram,
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
  <section className={styles.contact} aria-labelledby='contact-title'>
    <div className={styles.shell}>
      <header className={styles.header}>
        <p className={styles.eyebrow}>Estamos para ayudarte</p>
        <h2 id='contact-title'>Cuéntanos de tu mascota.</h2>
        <p className={styles.intro}>
          Te ayudamos a elegir productos, resolver dudas y coordinar tu pedido
          de una forma sencilla y cercana.
        </p>
        <ul className={styles.serviceDetails} aria-label='Horario de atención'>
          <li>
            <Clock3 aria-hidden='true' size={16} />
            {DNATURE_SUPPORT_HOURS}
          </li>
          <li>{DNATURE_SUPPORT_RESPONSE}</li>
        </ul>
      </header>

      <div className={styles.contentGrid}>
        <div className={styles.channels}>
          <div className={styles.channelList}>
            {contactChannels.map((channel) => {
              const Icon = channel.icon;
              const opensNewTab = channel.external !== false;

              return (
                <a
                  className={`${styles.channelCard} ${
                    channel.featured ? styles.featured : ''
                  }`}
                  href={channel.href}
                  key={channel.id}
                  {...(opensNewTab
                    ? { target: '_blank', rel: 'noopener noreferrer' }
                    : {})}
                >
                  <span className={styles.channelIcon} aria-hidden='true'>
                    {channel.brandIcon ? (
                      <FontAwesomeIcon icon={channel.brandIcon} />
                    ) : (
                      <Icon size={22} strokeWidth={1.9} />
                    )}
                  </span>
                  <span className={styles.channelCopy}>
                    <small>{channel.eyebrow}</small>
                    <strong>{channel.title}</strong>
                    <span>{channel.detail}</span>
                  </span>
                  <ArrowUpRight
                    className={styles.channelArrow}
                    aria-hidden='true'
                    size={18}
                  />
                </a>
              );
            })}
          </div>

          <div className={styles.assistanceNote}>
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

        <article className={styles.locationCard} aria-labelledby='location-title'>
          <div className={styles.mapFrame}>
            <Map />
          </div>
          <div className={styles.locationDetails}>
            <span className={styles.locationIcon} aria-hidden='true'>
              <MapPin size={22} strokeWidth={1.9} />
            </span>
            <div className={styles.locationCopy}>
              <p>Colima de Tibás · San José</p>
              <h3 id='location-title'>También podés pasar por nuestro local</h3>
              <span>
                Coordiná el horario antes de visitarnos para que podamos tener
                tu pedido listo.
              </span>
            </div>
            <a
              className={styles.mapLink}
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
