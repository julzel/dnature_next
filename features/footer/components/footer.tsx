import Link from "next/link";
import { AtSign, Mail, MapPin, MessageCircle } from "lucide-react";
import { ArrowCta } from "@/components/arrow-cta";
import { Logo } from "@/components/logo";
import { SectionEyebrow } from "@/components/section-eyebrow";
import { brand } from "@/lib/seo/config";
import contact from "@/features/contact/data/contact.json";
import styles from "./footer.module.css";

const exploreLinks = [
  { href: "/productos", label: "Productos" },
  { href: "/preguntas-frecuentes", label: "Preguntas frecuentes" },
  { href: "/nosotros", label: "Quiénes somos" },
  { href: "/alianzas", label: "Profesionales aliados" },
  { href: "/#contacto", label: "Contacto" },
];

const learnLinks = [
  { href: "/nosotros#proposito", label: "Nuestro propósito" },
  { href: "/nosotros#esencia", label: "Ciencia, conciencia y tribu" },
  { href: "/ciencia/nuestros-criterios", label: "Criterios de publicación" },
];

const contactLinks = [
  { href: contact.whatsapp.url, label: contact.whatsapp.display_number, icon: MessageCircle, external: true, accessibleName: `WhatsApp: ${contact.whatsapp.display_number}` },
  { href: contact.email.url, label: contact.email.address, icon: Mail, external: false, accessibleName: undefined },
  { href: contact.instagram.url, label: `@${contact.instagram.username}`, icon: AtSign, external: true, accessibleName: `Instagram: @${contact.instagram.username}` },
  { href: contact.map.url, label: "Ver ubicación", icon: MapPin, external: true, accessibleName: undefined },
];

export function Footer() {
  return (
    <footer id="footer" className={styles.footer} aria-label="Pie de página">
      <div className={styles.statement}>
        <div className={styles.container}>
          <SectionEyebrow label="Ciencia. Conciencia. Tribu." color="var(--dn-text-primary)" />
          <div className={styles.statementLayout}>
            <h2>{brand.tagline}</h2>
            <div className={styles.invitation}>
              <p>Elegir con información también es cuidar. Si tenés preguntas, conversemos.</p>
              <ArrowCta href={contact.whatsapp.url} label="Contáctanos por WhatsApp" target="_blank" rel="noopener noreferrer" aria-label="Contáctanos por WhatsApp (abre en otra pestaña)" />
            </div>
          </div>
        </div>
      </div>
      <div className={styles.directory}>
        <div className={styles.container}>
          <div className={styles.directoryLayout}>
            <div className={styles.brand}>
              <Link className={styles.logoLink} href="/" aria-label="DNAture, inicio"><Logo shape="full" color="white" size={200} alt="" /></Link>
              <p>Nutrición fisiológica para perros y gatos. Conocimiento y acompañamiento para elegir con información.</p>
            </div>
            <nav aria-label="Explorar DNAture" className={styles.navigation}>
              <h3>Explorá</h3>
              <ul>
                {exploreLinks.map(({ href, label }) => <li key={href}><Link className={styles.textLink} href={href}>{label}</Link></li>)}
              </ul>
            </nav>
            <nav aria-label="Conocer el enfoque DNAture" className={styles.navigation}>
              <h3>Conocé nuestro enfoque</h3>
              <ul>
                {learnLinks.map(({ href, label }) => <li key={href}><Link className={styles.textLink} href={href}>{label}</Link></li>)}
              </ul>
            </nav>
            <div className={styles.contact}>
              <h3>Sigamos cerca</h3>
              <address>
                <ul>
                  {contactLinks.map(({ href, label, icon: ChannelIcon, external, accessibleName }) => (
                    <li key={href}>
                      <a className={styles.textLink} href={href} aria-label={accessibleName ? `${accessibleName} (abre en otra pestaña)` : undefined} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined}>
                        <ChannelIcon size={18} strokeWidth={1.5} aria-hidden="true" />
                        <span>{label}</span>
                        {external && <span className="sr-only"> (abre en otra pestaña)</span>}
                      </a>
                    </li>
                  ))}
                </ul>
              </address>
            </div>
          </div>
          <div className={styles.bottom}>
            <p>DNAture · Costa Rica</p>
            <p>Ciencia para comprender. Conciencia para cuidar. Tribu para acompañar.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
