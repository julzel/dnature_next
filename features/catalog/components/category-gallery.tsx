import Image from "next/image";
import Link from "next/link";
import deshidratados from "@/public/images/categories/deshidratados.webp";
import recetas from "@/public/images/categories/recetas-completas.webp";
import complementos from "@/public/images/categories/complementos.webp";
import suplementos from "@/public/images/categories/suplementos.webp";
import organos from "@/public/images/categories/organos.webp";
import styles from "./category-gallery.module.css";

const categories = [
  { slug: "deshidratados", name: "Deshidratados", image: deshidratados },
  { slug: "recetas-completas", name: "Recetas completas", image: recetas },
  { slug: "complementos", name: "Complementos", image: complementos },
  { slug: "suplementos", name: "Suplementos", image: suplementos },
  { slug: "organos", name: "Órganos", image: organos },
];

export function CategoryGallery() {
  return (
    <section id="categorias" className={styles.section} aria-labelledby="category-gallery-title">
      <h2 id="category-gallery-title" className="sr-only">Categorías de productos</h2>
      <nav aria-label="Categorías de productos">
        <ul className={styles.gallery}>
          {categories.map(({ slug, name, image }, index) => (
            <li key={slug} className={styles.item} data-featured={index === 0 || undefined}>
              <Link className={styles.link} href={`/productos?categoria=${slug}`} prefetch={false}>
                <Image
                  src={image}
                  alt=""
                  fill
                  sizes={index === 0 ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 25vw, 50vw"}
                  placeholder="blur"
                  className={styles.image}
                />
                <span className={styles.name}>{name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </section>
  );
}
