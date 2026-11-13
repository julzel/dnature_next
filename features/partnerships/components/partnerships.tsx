import { ArrowDown, HeartHandshake, MoveUpRight } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { SectionEyebrow } from "@/components/section-eyebrow";
import partnersData from "../data/partners.json";
import type { Partner } from "../types/partner";
import { directoryEntry } from "../lib/directory";
import { PartnerDirectory } from "./partner-directory";
import { PartnerEntry } from "./partner-entry";
import styles from "./partnerships.module.css";

const partners = partnersData as Partner[];

export function Partnerships() {
  return <>
    <div className={styles.hero}><PageHero title="Profesionales" accent="aliados" titleId="partnerships-title"
      description="El cuidado también se construye en equipo. Conocé profesionales y servicios de salud y bienestar animal que pueden acompañarte."
      navigation={<Breadcrumbs items={[{ name: "Inicio", path: "/" }, { name: "Profesionales aliados", path: "/alianzas" }]} />}
      actions={<a href="#directorio">Encontrá tu profesional <ArrowDown size={20} strokeWidth={1.5} aria-hidden="true" /></a>} /></div>
    <section className={styles.statement} aria-labelledby="care-title">
      <div className={`${styles.container} ${styles.statementGrid}`}>
        <div><SectionEyebrow label="Cuidar en comunidad" color="var(--dn-text-primary)" lineColor="var(--dn-text-primary)" /><h2 id="care-title">Una tribu que<br />te acompaña<MoveUpRight size={48} strokeWidth={1} aria-hidden="true" /></h2></div>
        <div className={styles.statementCopy}><HeartHandshake size={48} strokeWidth={1} aria-hidden="true" /><p>Nutrición, conducta, movimiento y bienestar: cada mirada aporta a una atención más completa.</p><p>Encontrá el servicio que necesitás y conversá con quien lo ofrece.</p></div>
      </div>
    </section>
    <PartnerDirectory entries={partners.map(directoryEntry)}>{partners.map((partner) => <PartnerEntry key={partner.id} partner={partner} />)}</PartnerDirectory>
  </>;
}
