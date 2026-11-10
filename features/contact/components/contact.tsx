import { ArrowUpRight, AtSign, Mail, MessageCircle } from "lucide-react";
import { SectionEyebrow } from "@/components/section-eyebrow";
import contact from "../data/contact.json";
import { ContactMap } from "./contact-map";
import styles from "./contact.module.css";

const channels = [
  {
    name: "WhatsApp",
    value: contact.whatsapp.display_number,
    href: contact.whatsapp.url,
    icon: MessageCircle,
    external: true,
    primary: true,
  },
  {
    name: "Instagram",
    value: `@${contact.instagram.username}`,
    href: contact.instagram.url,
    icon: AtSign,
    external: true,
    primary: false,
  },
  {
    name: "Correo electrónico",
    value: contact.email.address,
    href: contact.email.url,
    icon: Mail,
    external: false,
    primary: false,
  },
];

export function Contact() {
  return (
    <section id="contacto" className={styles.contact} aria-label="Contacto">
      <div className={styles.container}>
        <SectionEyebrow label="Contacto" />
        <div className={styles.layout}>
          <div className={styles.details}>
            <h2>Hablemos de<br />su bienestar.</h2>
            <p className={styles.introduction}>
              ¿Tenés preguntas sobre nuestros productos o tu pedido?
              Estamos para ayudarte.
            </p>
            <address className={styles.address}>
              <ul className={styles.channels}>
                {channels.map(({ name, value, href, icon: ChannelIcon, external, primary }) => (
                  <li key={name}>
                    <a
                      className={styles.channel}
                      href={href}
                      target={external ? "_blank" : undefined}
                      rel={external ? "noopener noreferrer" : undefined}
                      data-primary={primary || undefined}
                    >
                      <ChannelIcon size={24} strokeWidth={1.5} aria-hidden="true" />
                      <span className={styles.channelCopy}>
                        <span className={styles.channelLabel}>{name}</span>
                        <span className={styles.channelValue}>{value}</span>
                      </span>
                      <span className={styles.channelArrow}>
                        <ArrowUpRight size={24} strokeWidth={1.5} aria-hidden="true" />
                      </span>
                      {external && <span className="sr-only"> (abre en otra pestaña)</span>}
                    </a>
                  </li>
                ))}
              </ul>
            </address>
          </div>
          <ContactMap />
        </div>
      </div>
    </section>
  );
}
