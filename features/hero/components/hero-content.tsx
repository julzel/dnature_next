import { ArrowCta } from "@/components/arrow-cta";
import { SectionEyebrow } from "@/components/section-eyebrow";
import styles from "./hero.module.css";

const actions = [
  { href: "/ciencia", label: "Lorem ipsum dolor" },
  { href: "/nosotros", label: "Consectetur adipiscing" },
] as const;

export function HeroContent() {
  return (
    <div className={styles.copy}>
      <SectionEyebrow label="100 % natural - Costa Rica" tone="light" />
      <h1 className={styles.heading}>
        <span>Su biología es</span>
        <span className={styles.highlight}>única.</span>
      </h1>
      <p className={styles.description}>
        Su nutrición merece atención individual. En DNAture unimos ciencia y
        naturaleza para nutrir con conciencia, respetando la esencia de cada
        mascota.
      </p>
      <div className={styles.actions}>
        {actions.map((action) => (
          <ArrowCta
            href={action.href}
            label={action.label}
            tone="light"
            key={action.href}
          />
        ))}
      </div>
    </div>
  );
}
