import Image from "next/image";
import { ArrowCta } from "@/components/arrow-cta";
import { SectionEyebrow } from "@/components/section-eyebrow";
import styles from "./partnerships-preview.module.css";

export function PartnershipsPreview() {
  return (
    <section id="alianzas" className={styles.section} aria-labelledby="partnerships-preview-title">
      <div className={styles.container}>
        <SectionEyebrow label="Alianzas DNAture" />
        <div className={styles.introduction}>
          <div className={styles.copy}>
            <h2 id="partnerships-preview-title">
              Cuidar es mejor <span>en manada.</span>
            </h2>
            <p>
              Su bienestar va más allá de la alimentación. Conocé profesionales
              de salud y bienestar animal que pueden acompañarte en su cuidado.
            </p>
          </div>
          <figure className={styles.artwork}>
            <Image
              src="/images/pets/dog-caring-for-cat-v2.svg"
              alt="Un perro mestizo apoya suavemente la cabeza sobre un gato atigrado acurrucado junto a él, mientras mira hacia el horizonte."
              width={1536}
              height={1024}
              unoptimized
            />
            <figcaption>Distintas miradas. Un mismo propósito.</figcaption>
          </figure>
        </div>
        <div className={styles.closing}>
          <p>Nutrición, conducta, movimiento y más.<br />Encontrá el acompañamiento que buscás.</p>
          <ArrowCta href="/alianzas" label="Conocer las alianzas" className={styles.cta} />
        </div>
      </div>
    </section>
  );
}
