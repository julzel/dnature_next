import Image from 'next/image';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram } from '@fortawesome/free-brands-svg-icons';
import {
  Mail,
  MapPin,
  MessageCircleMore,
} from 'lucide-react';

import {
  DNATURE_SUPPORT_HOURS,
  DNATURE_WHATSAPP_DISPLAY,
  DNATURE_WHATSAPP_PHONE,
} from '../../constants/contact';
import { STORE_GOOGLE_MAPS_URL } from '../../constants/store';
import styles from './Footer.module.scss';

const footerLinks = [
  { href: '/productos', label: 'Productos' },
  { href: '/calculadora', label: 'Calculadora de porciones' },
  { href: '/plan-dnature', label: 'Plan DNAture' },
  { href: '/preguntas-frecuentes', label: 'Preguntas frecuentes' },
  { href: '/cuenta/iniciar-sesion', label: 'Mi DNAture' },
];

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.shell}>
        <div className={styles.main}>
          <div className={styles.brand}>
            <Link className={styles.logo} href='/' aria-label='DNAture, ir al inicio'>
              <Image
                src='/images/dnature-logo.svg'
                alt='DNAture'
                width={55}
                height={42}
              />
            </Link>
            <p>Alimentación natural para cuidarles mejor, todos los días.</p>
            <div className={styles.socialLinks} aria-label='Redes y contacto'>
              <a
                href={`https://wa.me/${DNATURE_WHATSAPP_PHONE}`}
                target='_blank'
                rel='noopener noreferrer'
                aria-label={`Escribir a DNAture por WhatsApp al ${DNATURE_WHATSAPP_DISPLAY}`}
              >
                <MessageCircleMore aria-hidden='true' size={19} />
              </a>
              <a
                href='https://www.instagram.com/dnaturecr'
                target='_blank'
                rel='noopener noreferrer'
                aria-label='Visitar DNAture en Instagram'
              >
                <FontAwesomeIcon aria-hidden='true' icon={faInstagram} />
              </a>
              <a
                href='mailto:info@dnaturefood.com'
                aria-label='Escribir a info@dnaturefood.com'
              >
                <Mail aria-hidden='true' size={19} />
              </a>
            </div>
          </div>

          <nav className={styles.navigation} aria-label='Navegación del pie de página'>
            <h2>Explorá</h2>
            <ul>
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <section className={styles.contact} aria-labelledby='footer-contact-title'>
            <h2 id='footer-contact-title'>Estamos cerca</h2>
            <a
              className={styles.contactLink}
              href={`https://wa.me/${DNATURE_WHATSAPP_PHONE}`}
              target='_blank'
              rel='noopener noreferrer'
            >
              <MessageCircleMore aria-hidden='true' size={18} />
              <span>
                <strong>WhatsApp</strong>
                {DNATURE_WHATSAPP_DISPLAY}
              </span>
            </a>
            <p className={styles.schedule}>{DNATURE_SUPPORT_HOURS}</p>
            <a
              className={styles.locationLink}
              href={STORE_GOOGLE_MAPS_URL}
              target='_blank'
              rel='noopener noreferrer'
            >
              <MapPin aria-hidden='true' size={17} />
              Colima de Tibás, San José
            </a>
          </section>
        </div>

        <div className={styles.bottom}>
          <p>© {year} DNAture. Todos los derechos reservados.</p>
          <p>Hecho con cariño en Costa Rica.</p>
        </div>
      </div>
    </footer>
  );
};

export { footerLinks };
export default Footer;
