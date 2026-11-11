import Link from "next/link";
import type { ComponentProps } from "react";
import { ArrowUpRight } from "lucide-react";
import styles from "./arrow-cta.module.css";

type SharedProps = {
  label: string;
  tone?: "dark" | "light";
  className?: string;
  /** Use for actions displayed inline beside other content. */
  iconOnlyOnMobile?: boolean;
};

type LinkCtaProps = SharedProps & Omit<ComponentProps<typeof Link>, "children" | "className">;
type ButtonCtaProps = SharedProps & Omit<ComponentProps<"button">, "children" | "className"> & { href?: never };
export type ArrowCtaProps = LinkCtaProps | ButtonCtaProps;

/** The landing hero CTA: a native button or crawlable Next.js link. */
export function ArrowCta({ label, tone = "dark", className, iconOnlyOnMobile = false, ...props }: ArrowCtaProps) {
  const classes = [styles.cta, className].filter(Boolean).join(" ");
  const accessibleLabel = props["aria-label"] ?? (iconOnlyOnMobile ? label : undefined);
  const content = <>
    <span className={styles.label}>{label}</span>
    <ArrowUpRight size={32} strokeWidth={1.25} aria-hidden="true" />
  </>;

  if (props.href !== undefined) {
    return <Link {...props} className={classes} data-tone={tone} data-mobile-icon={iconOnlyOnMobile || undefined} aria-label={accessibleLabel}>{content}</Link>;
  }

  return <button {...props} type={props.type ?? "button"} className={classes} data-tone={tone} data-mobile-icon={iconOnlyOnMobile || undefined} aria-label={accessibleLabel}>{content}</button>;
}
