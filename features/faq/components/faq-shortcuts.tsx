import type { MouseEventHandler } from "react";
import { ArrowDownRight, ArrowRightLeft, Scale, ShoppingBag, Snowflake } from "lucide-react";
import styles from "./faq.module.css";

// Editorial entry points, not popularity claims or analytics rankings.
const shortcuts = [
  { id: "como-hacer-transicion", label: "Cambiar su alimentación", hint: "El primer paso", Icon: ArrowRightLeft },
  { id: "cantidad-diaria", label: "Conocer su porción", hint: "La cantidad importa", Icon: Scale },
  { id: "descongelar-correctamente", label: "Preparar su comida", hint: "Del frío a su plato", Icon: Snowflake },
  { id: "hacer-pedido", label: "Hacer un pedido", hint: "Te acompañamos", Icon: ShoppingBag },
];

export function FaqShortcuts({ onNavigate }: { onNavigate: MouseEventHandler<HTMLAnchorElement> }) {
  return (
    <nav className={styles.shortcuts} aria-label="Respuestas para empezar">
      <p>Un buen lugar para empezar</p>
      <ul>{shortcuts.map(({ id, label, hint, Icon }) => <li key={id}>
        <a href={`#pregunta-${id}`} onClick={onNavigate}>
          <Icon className={styles.shortcutIcon} size={36} strokeWidth={1.25} aria-hidden="true" />
          <span><small>{hint}</small><strong>{label}</strong></span>
          <ArrowDownRight className={styles.shortcutArrow} size={22} aria-hidden="true" />
        </a>
      </li>)}</ul>
    </nav>
  );
}
