import type { CSSProperties } from "react";
import styles from "./section-eyebrow.module.css";

type SectionEyebrowProps = {
  label: string;
  tone?: "dark" | "light";
  color?: CSSProperties["color"];
  lineColor?: CSSProperties["color"];
};

export function SectionEyebrow({ label, tone = "dark", color, lineColor }: SectionEyebrowProps) {
  const style = {
    "--eyebrow-color": color,
    "--eyebrow-line-color": lineColor,
  } as CSSProperties;

  return (
    <p className={styles.eyebrow} data-tone={tone} style={style}>
      <span>{label}</span>
    </p>
  );
}
