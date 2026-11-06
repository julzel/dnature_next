import styles from "./section-eyebrow.module.css";

type SectionEyebrowProps = {
  number: number;
  label: string;
  tone?: "dark" | "light";
};

export function SectionEyebrow({ number, label, tone = "dark" }: SectionEyebrowProps) {
  return (
    <p className={styles.eyebrow} data-tone={tone}>
      <span>{String(number).padStart(2, "0")} / {label}</span>
    </p>
  );
}
