import Image from "next/image";
import Link from "next/link";
import scienceImage from "@/images/dnatureplate.jpg";
import { FamilyBrowser } from "@/components/family-browser";
import { Icon } from "@/components/icon";
import { JsonLd } from "@/components/json-ld";
import { LandingHero } from "@/components/landing-hero";
import { questions } from "@/lib/landing-content";
import { siteIdentity } from "@/lib/seo/structured-data";

export function LandingPrototype() {
  return (
    <main id="contenido" className="home">
      <JsonLd data={siteIdentity()} />
      <LandingHero />
      <div className="care-strip shell" aria-label="Nuestro enfoque">
        <div><Icon name="paw" /><span>Su biología, nuestro punto de partida.</span></div>
        <div><Icon name="science" /><span>Información para elegir con criterio.</span></div>
        <div><Icon name="heart" /><span>Acompañamiento en cada etapa.</span></div>
      </div>
      <FamilyBrowser />
      <section className="why-section shell section-space" aria-labelledby="why-title">
        <div className="why-intro"><p className="eyebrow">Por qué DNAture</p><h2 id="why-title">Cuidar es ir<br />un poco más allá.</h2><p>No se trata solo de lo que hay en su plato. También de entender, preguntar y acompañar.</p><Link href="/nosotros" className="text-link">Conocé DNAture <Icon name="arrow" /></Link></div>
        <div className="values-list">
          <div><span className="value-number">01</span><div><h3>Respetar su esencia</h3><p>Cada animal tiene una biología y una historia. Ese es nuestro punto de partida.</p></div><Icon name="paw" /></div>
          <div><span className="value-number">02</span><div><h3>Explicar con claridad</h3><p>Menos promesas vacías. Más información sobre qué cumple cada producto y cuáles son sus límites.</p></div><Icon name="science" /></div>
          <div><span className="value-number">03</span><div><h3>Acompañar con empatía</h3><p>Aprender a su ritmo, hacer preguntas y tomar decisiones informadas también es una forma de cuidar.</p></div><Icon name="heart" /></div>
        </div>
      </section>
      <section className="science-section shell" aria-labelledby="science-title">
        <div className="science-visual"><Image src={scienceImage} alt="Ingredientes del portafolio en un recipiente DNAture" fill sizes="(max-width: 767px) 100vw, 45vw" /></div>
        <div className="science-copy"><p className="eyebrow">DNAture Science <span aria-hidden="true">↗</span></p><h2 id="science-title">La confianza<br />necesita evidencia.</h2><p>Conocé cómo entendemos la nutrición fisiológica y qué información debe respaldar una explicación nutricional.</p><Link className="button button-white" href="/ciencia">Explorar la ciencia <Icon name="arrow" /></Link><Link className="science-secondary" href="/ciencia/nuestros-criterios">Fuentes claras. Alcances y límites visibles.</Link></div>
      </section>
      <section id="preguntas" className="faq-section shell section-space" aria-labelledby="faq-title">
        <div><p className="eyebrow">Te acompañamos</p><h2 id="faq-title">Las buenas decisiones<br />empiezan con preguntas.</h2><p>Un poco de claridad para dar el primer paso.</p><Link className="text-link" href="/ciencia/nuestros-criterios">Conocer nuestros criterios <Icon name="arrow" /></Link></div>
        <div className="faq-list">{questions.map((item) => <details key={item.question}><summary>{item.question}<span className="faq-plus" aria-hidden="true" /></summary><p>{item.answer}</p></details>)}</div>
      </section>
      <section className="closing-section" aria-labelledby="closing-title"><div className="shell"><Icon name="paw" /><div><p className="eyebrow">Nutrición con esencia en el ADN.</p><h2 id="closing-title">Su historia es única.<br />Empecemos por conocerla.</h2></div><a className="button button-primary" href="#productos">Explorar las familias <Icon name="arrow" /></a></div></section>
    </main>
  );
}
