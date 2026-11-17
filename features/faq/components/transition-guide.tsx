import Link from "next/link";
import { ArrowRight, ArrowRightLeft, Cat, Check, ClipboardCheck, Dog, HeartPulse, Leaf, Plus, Soup } from "lucide-react";
import { SectionEyebrow } from "@/components/section-eyebrow";
import styles from "./transition-guide.module.css";

const contents = [
  { href: "#antes-de-empezar", label: "Antes de empezar" },
  { href: "#paso-a-paso", label: "El paso a paso" },
  { href: "#segun-tu-mascota", label: "Según tu mascota" },
  { href: "#cuando-consultar", label: "Cuándo consultar" },
];

const steps = [
  {
    title: "Elegí una receta y definí su porción.",
    description: "Confirmá que el alimento sea adecuado para su especie, etapa de vida y salud. Acordá la cantidad con su veterinario o el equipo de nutrición. Para empezar, elegí una sola receta: así será más fácil observar cómo la tolera.",
    hint: "Una receta a la vez.",
    Icon: Leaf,
  },
  {
    title: "Empezá con una pequeña cantidad.",
    description: "Introducí un poco del alimento nuevo junto a su comida habitual, siguiendo el plan acordado. No reemplaces toda su alimentación de golpe ni lo dejés sin comer para que acepte el cambio.",
    hint: "Poco a poco, desde el primer plato.",
    Icon: Soup,
  },
  {
    title: "Observá antes de aumentar.",
    description: "Revisá si come con normalidad, cómo son sus heces y si mantiene su actividad habitual. Si lo acepta y lo tolera bien, aumentá gradualmente el alimento nuevo y reducí el anterior según su plan. Si hay rechazo o molestias, no sigás aumentando: revisá el proceso con su veterinario.",
    hint: "Su respuesta marca el ritmo.",
    Icon: ArrowRightLeft,
  },
  {
    title: "Completá el cambio y mantené el seguimiento.",
    description: "Cuando tolere la nueva alimentación, completá la transición según el plan. Repartí su ración diaria entre sus comidas: es la cantidad total del día, no de cada toma. Con Complete, probá otras variantes por separado solo después de comprobar que está estable.",
    hint: "Primero estabilidad; después, variedad.",
    Icon: ClipboardCheck,
  },
];

export function TransitionGuide() {
  return (
    <article className={styles.guide} aria-label="Guía de transición a una dieta natural">
      <div className={styles.layout}>
        <nav className={styles.contents} aria-label="En esta guía">
          <p>En esta guía</p>
          <ol>{contents.map(({ href, label }) => <li key={href}><a href={href}>{label}<ArrowRight size={16} aria-hidden="true" /></a></li>)}</ol>
          <Link className={styles.backLink} href="/preguntas-frecuentes#pregunta-como-hacer-transicion">Volver a la pregunta</Link>
        </nav>

        <div className={styles.reading}>
          <section id="antes-de-empezar" className={styles.section} aria-labelledby="before-title">
            <SectionEyebrow label="El punto de partida" />
            <h2 id="before-title">El cambio empieza antes del plato.</h2>
            <p>La edad, la salud, lo que come hoy y sus hábitos influyen en la transición. El objetivo es que acepte su nuevo alimento y lo tolere bien, con una cantidad adecuada para sus necesidades.</p>
            <ul className={styles.checklist}>
              <li><Check size={20} aria-hidden="true" /><span>Elegí una <strong>receta completa para su especie y etapa de vida</strong>. Un complemento o una sola proteína no sustituyen una dieta completa.</span></li>
              <li><Check size={20} aria-hidden="true" /><span>Si tiene alergias, una enfermedad o problemas digestivos recurrentes, <strong>definí primero el plan con su veterinario</strong>. Complete y WILD no son adecuados para todos los casos.</span></li>
              <li><Check size={20} aria-hidden="true" /><span>Prepará el alimento según su etiqueta. <strong>WILD no debe cocinarse ni calentarse</strong> y se reserva para perros adaptados a la alimentación cruda y con experiencia de masticación.</span></li>
            </ul>
            <Link className={styles.textLink} href="/preguntas-frecuentes#pregunta-descongelar-correctamente">Cómo descongelar y conservar su comida <ArrowRight size={18} aria-hidden="true" /></Link>
          </section>

          <section id="paso-a-paso" className={styles.section} aria-labelledby="steps-title">
            <SectionEyebrow label="Del primer bocado a su nueva rutina" />
            <h2 id="steps-title">Cuatro pasos, a su ritmo.</h2>
            <ol className={styles.steps} aria-label="Pasos de la transición alimentaria">
              {steps.map(({ title, description, hint, Icon }, index) => <li key={title}>
                <div className={styles.stepMarker} aria-hidden="true"><span>{String(index + 1).padStart(2, "0")}</span><Icon size={36} strokeWidth={1.25} /></div>
                <div className={styles.stepCopy}><h3>{title}</h3><p>{description}</p><small>{hint}</small></div>
              </li>)}
            </ol>
            <div className={styles.pace}>
              <h3>¿Y cuántos días toma?</h3>
              <p>No hay un calendario único para todas las mascotas. La alimentación anterior, la edad, la salud y la aceptación del nuevo alimento pueden hacer necesario un ritmo más lento. Avanzá por su respuesta, sin forzar una fecha de llegada.</p>
            </div>
          </section>

          <section id="segun-tu-mascota" className={styles.section} aria-labelledby="species-title">
            <SectionEyebrow label="Cada mascota tiene su forma" />
            <h2 id="species-title">Lo que cambia según quién come.</h2>
            <p>Los pasos comparten una idea: introducir, observar y ajustar. Estos detalles ayudan a acompañar a cada mascota.</p>
            <div className={styles.disclosures}>
              <details open>
                <summary><Dog size={32} strokeWidth={1.25} aria-hidden="true" /><span>Si es un perro</span><Plus className={styles.plus} size={20} aria-hidden="true" /></summary>
                <div className={styles.detailBody}>
                  <p>Introducí una receta a la vez y observá el apetito, las heces, los vómitos y cualquier molestia. Antes de alternar sabores de Complete, comprobá que cada variante se tolera bien por separado.</p>
                  <p>Si es selectivo, ofrecé pequeñas cantidades del alimento nuevo junto al habitual. Si el rechazo persiste, pedí ayuda para ajustar el plan.</p>
                </div>
              </details>
              <details>
                <summary><Cat size={32} strokeWidth={1.25} aria-hidden="true" /><span>Si es un gato</span><Plus className={styles.plus} size={20} aria-hidden="true" /></summary>
                <div className={styles.detailBody}>
                  <p>Mantené un lugar fijo y tranquilo y el comedero que ya conoce. Empezá con pequeñas cantidades junto a su comida habitual: el olor y la textura también forman parte de la adaptación.</p>
                  <p>No aumentés si hay rechazo. Reducí la cantidad nueva y retomá más despacio, asegurándote de que siga comiendo. No lo castigues ni retirés abruptamente el alimento anterior.</p>
                  <p>Anotá qué ofreciste, la fecha y cómo lo aceptó. Si deja de comer o reduce mucho su consumo, consultá pronto a su veterinario; no esperés a que el hambre resuelva el cambio.</p>
                </div>
              </details>
              <details>
                <summary><HeartPulse size={32} strokeWidth={1.25} aria-hidden="true" /><span>Si necesita un plan especial</span><Plus className={styles.plus} size={20} aria-hidden="true" /></summary>
                <div className={styles.detailBody}>
                  <p>En cachorros y gatitos, confirmá que la receta esté indicada para crecimiento. La guía general no sustituye el ajuste individual de cantidades y nutrientes.</p>
                  <p>Las alergias, enfermedades, recuperación de una cirugía, gestación o lactancia requieren valorar la dieta y la transición con su veterinario. Una dieta de eliminación o un cambio por microdosis necesita un plan específico; no se improvisa a partir de una sola carne o ingrediente.</p>
                </div>
              </details>
            </div>
          </section>

          <section id="cuando-consultar" className={styles.section} aria-labelledby="consult-title">
            <SectionEyebrow label="Observar también es cuidar" />
            <h2 id="consult-title">Cuándo pausar y pedir ayuda.</h2>
            <p>No sigás aumentando el alimento nuevo si aparecen molestias. Consultá con su médico veterinario si hay vómitos repetidos, diarrea intensa, sangre en las heces, dolor o decaimiento.</p>
            <p>En gatos, dejar de comer o reducir mucho el consumo merece atención pronta. Los cachorros, animales mayores o con enfermedades necesitan especial cuidado ante cambios digestivos.</p>
            <Link className={styles.textLink} href="/preguntas-frecuentes#pregunta-necesidades-especificas">Conocé la asesoría nutricional personalizada <ArrowRight size={18} aria-hidden="true" /></Link>
          </section>

          <details className={styles.sources}>
            <summary>Sobre esta guía <Plus className={styles.plus} size={18} aria-hidden="true" /></summary>
            <div className={styles.detailBody}>
              <p>Adaptación de la guía introductoria de alimentación fisiológica de DNAture: selección de dieta (p. 7), transición en perros (pp. 9–14), adaptación felina (pp. 23–25), ración diaria (pp. 25–26), uso de Complete y WILD (pp. 38 y 78–79) y señales de consulta (p. 84). Las referencias corresponden a las páginas del archivo PDF.</p>
              <p>Los pasos son orientación general. Las cantidades, la preparación y el ritmo se ajustan al producto y a cada mascota con su profesional tratante.</p>
              <p>Para ampliar: <a href="https://www.aaha.org/wp-content/uploads/globalassets/02-guidelines/nutritional-assessment/nutritionalassessmentguidelines.pdf" target="_blank" rel="noopener noreferrer">Evaluación nutricional de perros y gatos · AAHA <span className="sr-only">(abre en otra pestaña)</span></a> y <a href="https://www.vet.cornell.edu/departments-centers-and-institutes/cornell-feline-health-center/health-information/feline-health-topics/anorexia" target="_blank" rel="noopener noreferrer">Falta de apetito en gatos · Cornell <span className="sr-only">(abre en otra pestaña)</span></a>.</p>
            </div>
          </details>
        </div>
      </div>
    </article>
  );
}
