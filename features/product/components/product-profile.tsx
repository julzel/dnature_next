import { PetSpeciesImage } from "@/components/pet-species-image";
import { SectionEyebrow } from "@/components/section-eyebrow";
import type { ProductReference } from "@/features/catalog/types/product-reference";
import styles from "./product-detail.module.css";

const speciesNames = { dog: "Perros", cat: "Gatos" };

export function ProductProfile({ reference, compact = false }: { reference: ProductReference; compact?: boolean }) {
  return <section className={styles.profile} data-compact={compact} aria-label={compact ? "Resumen del producto" : "Perfil de referencia del producto"}>
    {!compact && <SectionEyebrow label="Perfil del producto" />}
    <p className={styles.productKind}>{reference.kind}</p>
    <dl className={styles.profileFacts}>
      <div>
        <dt>Especies indicadas</dt>
        <dd className={styles.species}>{reference.species.map((species) => <span key={species}>
          <PetSpeciesImage species={species} alt="" size={32} />{speciesNames[species]}
        </span>)}</dd>
      </div>
      <div><dt>Etapas indicadas</dt><dd>{reference.lifeStages.join(" · ")}</dd></div>
      {!compact && <div><dt>Tamaños indicados</dt><dd className={styles.sizeNames}>{reference.sizes.join(" · ")}</dd></div>}
      {!compact && reference.chewing && <div><dt>Nivel de masticación</dt><dd>{reference.chewing}</dd></div>}
    </dl>
    {!compact && <p className={styles.referenceNote}>Perfil orientativo del catálogo. Confirmá que se ajuste a las necesidades de tu mascota.</p>}
  </section>;
}
