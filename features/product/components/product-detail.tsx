import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { SectionEyebrow } from "@/components/section-eyebrow";
import { canonicalUrl } from "@/lib/seo/config";
import { categoryPath, categoryStyle } from "@/features/catalog/lib/browse-catalog";
import { CatalogProductPreview } from "@/features/catalog/components/catalog-product-preview";
import catalogStyles from "@/features/catalog/components/catalog-page.module.css";
import type { ProductDetail as ProductDetailData } from "../types/product";
import { productSummary } from "../lib/product-detail";
import { ProductGallery } from "./product-gallery";
import { ProductOptions } from "./product-options";
import { ProductDescription } from "./product-description";
import { ProductProfile } from "./product-profile";
import { ProductPrecautions } from "./product-precautions";
import styles from "./product-detail.module.css";

export function ProductDetail({ product }: { product: ProductDetailData }) {
  const category = product.categories[0];
  const breadcrumbs = [
    { name: "Inicio", path: "/" },
    { name: "Productos", path: "/productos" },
    ...(category ? [{ name: category.label, path: categoryPath(category) }] : []),
    { name: product.name, path: product.path },
  ];

  return <article className={styles.page} style={category ? categoryStyle(category) : undefined}>
    <div className={styles.container}>
      <div className={styles.breadcrumbs}><Breadcrumbs items={breadcrumbs} /></div>
      <div className={styles.overview}>
        <ProductGallery images={product.images} name={product.name} />
        <div className={styles.summary}>
          {category && <Link className={styles.category} href={categoryPath(category)} prefetch={false}>{category.label}</Link>}
          <h1>{product.name}</h1>
          <ProductOptions
            name={product.name}
            options={product.options}
            url={canonicalUrl(product.path)}
            profile={product.reference && <ProductProfile reference={product.reference} />}
            precautions={product.reference && <ProductPrecautions reference={product.reference} />}
          />
          <Link className={styles.backLink} href="/productos" prefetch={false}><ArrowLeft size={18} aria-hidden="true" />Volver al catálogo</Link>
        </div>
      </div>
      <nav className={styles.sectionNav} aria-label="Información del producto">
        <a href="#ingredientes">Ingredientes</a>
        <a href="#detalles">Detalle del producto</a>
        <a href="#uso-y-cuidados">Uso y cuidados</a>
      </nav>
      <div className={styles.information}>
        <div className={styles.productInformation}>
          <section id="ingredientes" className={styles.ingredients} aria-labelledby="product-ingredients-title">
            <SectionEyebrow label="Composición" />
            <h2 id="product-ingredients-title">Ingredientes</h2>
            <p>{product.ingredients || "Consultanos para confirmar la lista de ingredientes de esta presentación."}</p>
          </section>
          <section id="detalles" aria-labelledby="product-information-title">
            <SectionEyebrow label="En detalle" />
            <h2 id="product-information-title">Conocé este producto</h2>
            {product.description.length ? <ProductDescription blocks={product.description} /> : <p>Consultanos para conocer más sobre este producto.</p>}
            <dl className={styles.facts}>
              <div><dt>SKU del producto</dt><dd>{product.sku}</dd></div>
              {product.categories.length > 0 && <div><dt>Categorías</dt><dd>{product.categories.map((item, index) => <span key={item.id}>{index > 0 && " · "}<Link href={categoryPath(item)} prefetch={false}>{item.label}</Link></span>)}</dd></div>}
            </dl>
          </section>
        </div>
        <aside id="uso-y-cuidados" className={styles.guidance} aria-labelledby="product-guidance-title">
          <SectionEyebrow label="Uso y cuidados" />
          <h2 id="product-guidance-title">Elegir con información también es cuidar.</h2>
          <dl className={styles.usageFacts}>
            <div><dt>Porciones y frecuencia</dt><dd>Confirmá la cantidad y la frecuencia con nuestro equipo y el profesional que acompaña su alimentación.</dd></div>
            <div><dt>Conservación</dt><dd>Seguí las indicaciones del envase de tu presentación. Si tenés dudas, consultanos antes de usarla.</dd></div>
          </dl>
          <Link href="/#contacto">Hablemos de su alimentación <ArrowUpRight size={18} aria-hidden="true" /></Link>
          <Link href="/preguntas-frecuentes">Consultar preguntas frecuentes <ArrowUpRight size={18} aria-hidden="true" /></Link>
          {product.reference && <details className={styles.sourceDetails}>
            <summary>Sobre la información del producto</summary>
            <p>El perfil y las precauciones provienen del catálogo de referencia DNAture. Son información general y no una evaluación individual de tu mascota.</p>
            <p>Los ingredientes y la descripción corresponden a la ficha publicada. Las presentaciones, el precio y la disponibilidad se actualizan desde nuestra tienda.</p>
          </details>}
        </aside>
      </div>
      {product.related.length > 0 && <section className={styles.related} aria-labelledby="related-products-title">
        <SectionEyebrow label="Más opciones" />
        <h2 id="related-products-title">Seguí explorando {category?.label.toLocaleLowerCase("es") ?? "el catálogo"}</h2>
        <ul className={catalogStyles.productGrid}>{product.related.map((item) => <CatalogProductPreview key={item.sku} product={item} categories={product.categories} />)}</ul>
      </section>}
    </div>
    {/* Product/Offer schema remains subject to the verified-record gate in lib/seo/structured-data.ts. */}
    <JsonLd data={{ "@context": "https://schema.org", "@type": "WebPage", name: product.name, url: canonicalUrl(product.path), description: productSummary(product), inLanguage: "es-CR" }} />
  </article>;
}
