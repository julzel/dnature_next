import { Breadcrumbs } from "@/components/breadcrumbs";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({ path: "/ciencia/nuestros-criterios", title: "Nuestros criterios de publicación", description: "Fuentes, revisión profesional, información de cada fórmula y límites de uso: los criterios editoriales de DNAture para publicar información nutricional." });

export default function Criteria() {
  return <main id="contenido" className="shell article">
    <Breadcrumbs items={[{ name: "Inicio", path: "/" }, { name: "Nuestros criterios", path: "/ciencia/nuestros-criterios" }]} />
    <p className="eyebrow">Transparencia editorial</p>
    <h1>Nuestros criterios de publicación</h1>
    <p className="lead">Esta es la pauta que debe cumplir la información nutricional antes de publicarse en DNAture.</p>
    <section><h2>Datos de la fórmula específica</h2><p>Las afirmaciones sobre ingredientes, composición, especie, etapa de vida y función nutricional deben corresponder al producto concreto. Una referencia de marca no constituye una certificación del producto.</p></section>
    <section><h2>Fuentes que se puedan consultar</h2><p>Cada explicación científica debe identificar sus fuentes, la edición o fecha pertinente, el alcance de la información y las limitaciones. Una referencia general no demuestra un resultado clínico de una receta.</p></section>
    <section><h2>Revisión profesional identificable</h2><p>Las recomendaciones sobre alimentación y salud necesitan una revisión por un profesional competente. Su nombre, credenciales verificadas y fecha de revisión deben acompañar el contenido aprobado.</p></section>
    <section><h2>Qué debe quedar claro</h2><dl className="evidence">
      <dt>Qué sabemos</dt><dd>La afirmación que puede respaldarse con los datos disponibles.</dd>
      <dt>En qué se basa</dt><dd>Las fuentes y la documentación que sustentan esa afirmación.</dd>
      <dt>Qué no podemos concluir</dt><dd>Las incertidumbres, los límites y los casos a los que no aplica.</dd>
      <dt>Cuándo consultar</dt><dd>Las situaciones que requieren una evaluación veterinaria individual.</dd>
      <dt>Revisado por</dt><dd>La persona responsable de la revisión y la fecha real de aprobación.</dd>
    </dl></section>
    <section><h2>Fechas y correcciones</h2><p>Las fechas de actualización deben reflejar cambios reales en el contenido. Una modificación en la fórmula, las indicaciones o la evidencia requiere una nueva revisión.</p></section>
  </main>;
}
