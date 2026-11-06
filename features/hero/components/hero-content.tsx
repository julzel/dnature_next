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
      <SectionEyebrow label="Lorem ipsum dolor" tone="light" />
      <h1 className={styles.heading}>
        <span>Lorem ipsum</span>{" "}
        <span>dolor sit</span>{" "}
        <span className={styles.highlight}>amet.</span>
      </h1>
      <p className={styles.description}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt.
      </p>
      <div className={styles.actions}>
        {actions.map((action) => (
          <ArrowCta href={action.href} label={action.label} tone="light" key={action.href} />
        ))}
      </div>
    </div>
  );
}
