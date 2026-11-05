import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { brand } from "@/lib/seo/config";
import { pageMetadata } from "@/lib/seo/metadata";
import { siteIdentity } from "@/lib/seo/structured-data";

export const metadata = pageMetadata({
  path: "/",
  title: brand.tagline,
  description: brand.description,
});

export default function Home() {
  return (
    <main id="contenido" className="shell home">
      <JsonLd data={siteIdentity()} />
      <section className="hero" aria-labelledby="home-title">
        <p className="eyebrow">Nutrición · Educación · Acompañamiento</p>
        <h1 id="home-title">Nutrición con esencia en el ADN</h1>
        <p className="lead">DNAture parte del respeto por la biología de cada animal. Queremos acompañarte con información clara para comprender su alimentación y elegir con criterio.</p>
        <Link className="primary-link" href="/nosotros">Conocé DNAture <span aria-hidden="true">↗</span></Link>
      </section>
      <section className="editorial-index" aria-labelledby="explore-title">
        <h2 id="explore-title">Información para elegir con criterio</h2>
        <Link className="editorial-row" href="/ciencia">
          <span className="row-number" aria-hidden="true">01</span>
          <span><strong>Ciencia y nutrición fisiológica</strong><span>El enfoque de DNAture y las preguntas que orientan nuestra comunicación.</span></span>
          <span aria-hidden="true">↗</span>
        </Link>
        <Link className="editorial-row" href="/ciencia/nuestros-criterios">
          <span className="row-number" aria-hidden="true">02</span>
          <span><strong>Nuestros criterios de publicación</strong><span>Fuentes, revisión profesional y límites de la información nutricional.</span></span>
          <span aria-hidden="true">↗</span>
        </Link>
      </section>
    </main>
  );
}
