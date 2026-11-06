import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import styles from "./arrow-cta.module.css";

type ArrowCtaProps = {
  href: string;
  label: string;
  tone?: "dark" | "light";
  className?: string;
};

export function ArrowCta({ href, label, tone = "dark", className }: ArrowCtaProps) {
  return (
    <Link className={[styles.cta, className].filter(Boolean).join(" ")} href={href} data-tone={tone}>
      <span>{label}</span>
      <ArrowUpRight size={32} strokeWidth={1.25} aria-hidden="true" />
    </Link>
  );
}
