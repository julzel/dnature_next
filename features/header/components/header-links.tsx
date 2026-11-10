import Link from "next/link";
import { headerLinks } from "../data/navigation";
import navEffect from "@/components/center-out-nav-link.module.css";
import styles from "./header-links.module.css";

type HeaderLinksProps = {
  activeHref?: string;
  onNavigate?: () => void;
};

export function HeaderLinks({ activeHref, onNavigate }: HeaderLinksProps) {
  return headerLinks.map(({ href, label }) => (
    <Link
      key={href}
      href={href}
      className={`${navEffect.link} ${styles.link}`}
      aria-current={activeHref === href ? (href.includes("#") ? "location" : "page") : undefined}
      onClick={onNavigate}
    >
      {label}
    </Link>
  ));
}
