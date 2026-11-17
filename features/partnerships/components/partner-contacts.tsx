import { AtSign, CalendarDays, Globe, Phone } from "lucide-react";
import { ArrowCta } from "@/components/arrow-cta";
import type { Partner } from "../types/partner";
import styles from "./partnerships.module.css";

export function PartnerContacts({ partner }: { partner: Partner }) {
  const booking = partner.links.find((link) => link.kind === "booking");
  const social = partner.links.filter((link) => link.kind !== "booking");
  return <div className={styles.contacts}>
    {booking && <ArrowCta className={styles.booking} href={booking.href} label="Reservar cita" target="_blank" rel="noopener noreferrer" aria-label={`Reservar cita con ${partner.name} (abre en otra pestaña)`} />}
    <address>
      {partner.phones.map((phone) => <a key={phone.href} className={styles.phone} href={phone.href} aria-label={`Llamar a ${partner.name}: ${phone.label}`}><Phone size={17} strokeWidth={1.5} aria-hidden="true" />{phone.label}</a>)}
    </address>
    {partner.contactNote && <p className={styles.contactNote}>{partner.contactNote}</p>}
    {social.length > 0 && <div className={styles.socialLinks}>
      {social.map((link) => <a key={link.kind} href={link.href} target="_blank" rel="noopener noreferrer" aria-label={`${link.kind === "website" ? "Sitio web" : "Instagram"} de ${partner.name} (abre en otra pestaña)`}>
        {link.kind === "website" ? <Globe size={19} strokeWidth={1.5} aria-hidden="true" /> : <AtSign size={19} strokeWidth={1.5} aria-hidden="true" />}
        <span>{link.kind === "website" ? "Sitio web" : "Instagram"}</span>
      </a>)}
    </div>}
    {booking && <p className={styles.bookingNote}><CalendarDays size={14} aria-hidden="true" />Reserva en el sitio del profesional</p>}
  </div>;
}
