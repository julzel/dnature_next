"use client";

import Image from "next/image";
import { useState, type MouseEvent } from "react";
import type { ProductImage } from "../types/product";
import styles from "./product-detail.module.css";

export function ProductGallery({ images, name }: { images: ProductImage[]; name: string }) {
  const [selected, setSelected] = useState(0);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const active = images[selected] ?? images[0];

  function handleImageClick(event: MouseEvent<HTMLButtonElement>) {
    const index = Number(event.currentTarget.dataset.index);
    if (images[index] && (index !== selected || failed)) {
      setSelected(index);
      setFailed(false);
      setLoading(true);
    }
  }

  function handleImageLoad() { setLoading(false); }
  function handleImageError() { setLoading(false); setFailed(true); }

  return (
    <div className={styles.gallery}>
      <div className={styles.mainImage} aria-busy={loading}>
        {active && !failed ? <Image key={active.id} src={active.url} alt={active.alt} fill sizes="(min-width: 1344px) 608px, (min-width: 900px) 46vw, 100vw" loading="eager" onLoad={handleImageLoad} onError={handleImageError} /> : <p className={styles.imageFallback} role="status">Imagen de {name} no disponible</p>}
        {loading && <p className={styles.imageStatus} role="status">Cargando imagen…</p>}
      </div>
      {images.length > 1 && <div className={styles.thumbnails} role="group" aria-label="Imágenes del producto">
        {images.map((image, index) => <button key={image.id} type="button" data-index={index} onClick={handleImageClick} aria-label={`Ver imagen ${index + 1} de ${name}`} aria-pressed={selected === index}>
          <Image src={image.url} alt="" width={80} height={80} />
        </button>)}
      </div>}
      {images.length > 1 && <noscript><div className={styles.imageLinks}>{images.map((image, index) => <a key={image.id} href={image.url}>Ver imagen {index + 1}</a>)}</div></noscript>}
    </div>
  );
}
