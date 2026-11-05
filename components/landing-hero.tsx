"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import heroImage from "@/images/hero3.jpg";
import { Icon } from "./icon";
import { Modal } from "./modal";

const modes = [
  { id: "discover", label: "Descubrir", eyebrow: "Su esencia es única. Su nutrición también importa.", heading: "Su nutrición empieza por conocerlo.", body: "Cada mascota tiene su propia historia. Te acompañamos a entender su alimentación y a elegir con información clara, a su ritmo y al tuyo." },
  { id: "mine", label: "Mi DNAture", eyebrow: "Un espacio para seguir compartiendo", heading: "Menos pasos. Más tiempo juntos.", body: "Tu historia con DNAture empieza con una elección informada. Conocé las familias y encontrá un punto de partida para su rutina." },
  { id: "science", label: "Ciencia", eyebrow: "Preguntar también es cuidar", heading: "La confianza necesita evidencia.", body: "Entender qué hay detrás de una receta es parte de elegir. Explorá nuestro enfoque y los criterios que debe cumplir la información nutricional." },
] as const;

export function LandingHero() {
  const [selected, setSelected] = useState(0);
  const [species, setSpecies] = useState<"Perro" | "Gato" | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const mode = modes[selected];
  return <>
    <div className="experience-bar shell">
      <span className="experience-label">Un mismo cuidado. Distintas formas de explorar.</span>
      <div role="tablist" aria-label="Tu experiencia DNAture" className="experience-tabs">
        {modes.map((item, index) => <button key={item.id} ref={(element) => { tabs.current[index] = element; }} id={`experience-${item.id}`} role="tab" type="button" aria-selected={selected === index} aria-controls="experience-panel" tabIndex={selected === index ? 0 : -1} onClick={() => setSelected(index)} onKeyDown={(event) => {
          let next = index;
          if (event.key === "ArrowRight") next = (index + 1) % modes.length;
          else if (event.key === "ArrowLeft") next = (index + modes.length - 1) % modes.length;
          else if (event.key === "Home") next = 0;
          else if (event.key === "End") next = modes.length - 1;
          else return;
          event.preventDefault(); setSelected(next); tabs.current[next]?.focus();
        }}>{item.label}</button>)}
      </div>
    </div>
    <section className="landing-hero shell" aria-labelledby="home-title">
      <div id="experience-panel" role="tabpanel" aria-labelledby={`experience-${mode.id}`} className="hero-copy" tabIndex={0}>
        <p className="eyebrow"><span className="eyebrow-dot" />{mode.eyebrow}</p>
        <h1 id="home-title">{mode.heading}</h1>
        <p className="hero-description">{mode.body}</p>
        <div className="hero-actions">
          {mode.id === "discover" ? <button className="button button-primary" type="button" onClick={(event) => { event.currentTarget.focus(); setSpecies(null); dialog.current?.showModal(); }}>Empezar por mi mascota <Icon name="arrow" /></button> : <Link className="button button-primary" href={mode.id === "science" ? "/ciencia" : "#productos"}>{mode.id === "science" ? "Explorar la ciencia" : "Explorar productos"}<Icon name="arrow" /></Link>}
          <a className="text-link" href="#productos">Ver productos <Icon name="arrow" /></a>
        </div>
        <p className="hero-note"><Icon name="check" />Sin crear un perfil. Con toda la libertad de explorar.</p>
      </div>
      <div className="hero-visual">
        <Image className="hero-photo" src={heroImage} alt="Un perro pastor australiano junto a su plato de alimento" fill sizes="(max-width: 767px) 100vw, 50vw" preload />
        <div className="signature-tab" aria-hidden="true"><Icon name="paw" /></div>
        <div className="photo-caption"><span>Su bienestar empieza</span><strong>por conocer su esencia.</strong><span className="caption-mark" aria-hidden="true">↗</span></div>
      </div>
    </section>
    <Modal dialogRef={dialog} titleId="discovery-title" onClose={() => setSpecies(null)}>
      <p className="eyebrow">Un primer paso, a su ritmo</p><h2 id="discovery-title">¿Quién te acompaña?</h2><p>Elegí por dónde empezar. No guardamos un perfil ni hacemos recomendaciones individuales.</p>
      <fieldset className="species-options"><legend className="sr-only">Especie de tu mascota</legend>{(["Perro", "Gato"] as const).map((item) => <label key={item} className={`species-option ${species === item ? "selected" : ""}`}><input type="radio" name="species" value={item} checked={species === item} onChange={() => setSpecies(item)} /><Icon name="paw" /><span>{item}</span><Icon name="check" /></label>)}</fieldset>
      <div role="status" className="discovery-result">{species ? <><strong>Empecemos por entender su alimentación.</strong><p>La especie es un punto de partida. La función y las indicaciones se revisan en cada fórmula.</p><Link className="button button-primary" href="/ciencia" onClick={() => dialog.current?.close()}>Conocer el enfoque DNAture <Icon name="arrow" /></Link></> : <p className="small muted">Podés seguir explorando sin elegir una opción.</p>}</div>
      <a href="#productos" className="text-link" onClick={() => dialog.current?.close()}>Prefiero ver las familias de productos <Icon name="arrow" /></a>
    </Modal>
  </>;
}
