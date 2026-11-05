import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({ path: "/nosotros", title: "Quiénes somos", description: "Conocé el propósito de DNAture: respetar la biología de cada animal y acompañar a sus tutores con educación y comunicación responsable." });

export default function About() {
  return <main id="contenido" className="shell article">
    <Breadcrumbs items={[{ name: "Inicio", path: "/" }, { name: "Nosotros", path: "/nosotros" }]} />
    <p className="eyebrow">Conocer DNAture</p>
    <h1>Quiénes somos</h1>
    <p className="lead">Nutrición con esencia en el ADN. Nuestro propósito parte del respeto por la biología de cada animal y del acompañamiento a quienes lo cuidan.</p>
    <section><h2>Educar también es acompañar</h2><p>Queremos que los tutores puedan entender la información que encuentran: qué función cumple un producto, qué datos lo respaldan y cuáles son sus límites de uso.</p></section>
    <section><h2>Claridad antes de elegir</h2><p>Recetas, complementos, masticables, treats y suplementos son familias distintas. El nombre de una familia no reemplaza la información de la etiqueta de cada fórmula.</p><Link href="/ciencia">Conocé nuestro enfoque de nutrición fisiológica</Link></section>
    <section><h2>Una comunicación responsable</h2><p>Nuestro compromiso editorial es diferenciar los hechos documentados de las recomendaciones y de la información que todavía necesita verificación.</p><Link href="/ciencia/nuestros-criterios">Consultá nuestros criterios de publicación</Link></section>
  </main>;
}
