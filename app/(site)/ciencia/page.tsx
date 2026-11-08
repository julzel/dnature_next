import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({ path: "/ciencia", title: "Ciencia y nutrición fisiológica", description: "Conocé cómo DNAture plantea la nutrición fisiológica y qué información requiere antes de publicar una explicación o recomendación nutricional." });

export default function Science() {
  return <main id="contenido" className="shell article">
    <Breadcrumbs items={[{ name: "Inicio", path: "/" }, { name: "Ciencia", path: "/ciencia" }]} />
    <p className="eyebrow">Entender para elegir</p>
    <h1>Ciencia y nutrición fisiológica</h1>
    <p className="lead">Para DNAture, la nutrición fisiológica parte de una pregunta: ¿qué necesita cada animal de acuerdo con su biología?</p>
    <section><h2>El enfoque no sustituye la evidencia</h2><p>Hablar de nutrición fisiológica expresa nuestro enfoque de marca. Por sí solo, ese término no demuestra la eficacia, la composición ni la adecuación de una fórmula concreta.</p></section>
    <section><h2>La función de cada producto importa</h2><p>Antes de elegir, es necesario revisar la función nutricional declarada, los ingredientes, la composición y las indicaciones del producto específico. No atribuimos una misma función a todas las recetas o a todos los complementos.</p><Link href="/productos">Explorar los productos DNAture</Link></section>
    <section><h2>Información con contexto y límites</h2><p>La información general no reemplaza una evaluación veterinaria individual. Las recomendaciones nutricionales requieren fuentes identificables y una revisión profesional acorde con el tema.</p><Link href="/ciencia/nuestros-criterios">Cómo se evalúa la información antes de publicarla</Link></section>
  </main>;
}
