import { Eye, Info } from "lucide-react";
import type { ProductReference } from "@/features/catalog/types/product-reference";
import styles from "./product-detail.module.css";

export function ProductPrecautions({ reference }: { reference: ProductReference }) {
  const restrictions = reference.restrictions.replace(/^Alergias específicas\s*[/-]?\s*/i, "").trim();
  const allergens = reference.allergens && reference.allergens !== "Revisar componentes" ? reference.allergens : null;

  return <div className={styles.precautions} aria-labelledby="product-precautions-title">
    <h3 id="product-precautions-title"><Info size={18} aria-hidden="true" />Antes de elegir</h3>
    <ul>
      {reference.supervision && <li className={styles.supervision}><Eye size={18} aria-hidden="true" /><strong>{reference.supervision}.</strong></li>}
      {reference.chokingRisk && <li>Riesgo de atragantamiento indicado: <strong>{reference.chokingRisk.toLocaleLowerCase("es")}.</strong></li>}
      {reference.complementary && <li><strong>No es una dieta completa.</strong> Se incorpora como parte de su alimentación.</li>}
      <li>{allergens ? <>Sensibilidades a revisar: <strong>{allergens}.</strong></> : "Revisá los ingredientes si hay alergias o intolerancias."}</li>
      {restrictions && <li>Restricciones indicadas en el catálogo: <strong>{restrictions}.</strong> Consultá con tu veterinario antes de ofrecerlo.</li>}
    </ul>
  </div>;
}
