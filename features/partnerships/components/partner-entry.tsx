import { House, Laptop, MapPin } from "lucide-react";
import type { Partner } from "../types/partner";
import { PartnerContacts } from "./partner-contacts";
import styles from "./partnerships.module.css";

export function PartnerEntry({ partner }: { partner: Partner }) {
  return <article className={styles.entry} aria-labelledby={`${partner.id}-name`}>
    <div className={styles.identity}>
      <p className={styles.group}>{partner.group === "health" ? partner.services[0] : "Bienestar no veterinario"}</p>
      <h3 id={`${partner.id}-name`}>{partner.name}</h3>
      {partner.organization && <p className={styles.organization}>{partner.organization}</p>}
      <p className={styles.description}>{partner.summary}</p>
      <ul className={styles.modalities} aria-label={`Modalidades de ${partner.name}`}>
        {partner.modalities.map((mode) => <li key={mode}>
          {mode === "online" ? <Laptop size={17} strokeWidth={1.5} aria-hidden="true" /> : mode === "home_visit" ? <House size={17} strokeWidth={1.5} aria-hidden="true" /> : <MapPin size={17} strokeWidth={1.5} aria-hidden="true" />}
          {mode === "online" ? "En línea" : mode === "home_visit" ? "A domicilio" : "Presencial"}
        </li>)}
      </ul>
      {partner.location && <p className={styles.location}>{partner.location}</p>}
    </div>
    <PartnerContacts partner={partner} />
  </article>;
}
