import Link from "next/link";
import { Icon } from "./icon";
import { Logo } from "./logo";

export function SiteFooter() {
  return <footer className="site-footer">
    <div className="shell footer-main">
      <div className="footer-brand"><Link href="/" aria-label="DNAture, inicio"><Logo color="white" size={190} height={38} alt="" /></Link><p>Nutrición con esencia en el ADN.</p><span>Más información.<br />Más momentos juntos.</span></div>
      <div><h2>Explorar</h2><Link href="/productos">Familias de productos</Link><Link href="/nosotros">Conocer DNAture</Link><Link href="/prototype#preguntas">Preguntas frecuentes</Link></div>
      <div><h2>Aprender</h2><Link href="/ciencia">Ciencia y nutrición</Link><Link href="/ciencia/nuestros-criterios">Nuestros criterios</Link><Link href="/prototype#preguntas">Cómo empezar</Link></div>
      <div className="footer-message"><Icon name="heart" /><p>Elegir con información<br />también es cuidar.</p></div>
    </div>
    <div className="shell footer-bottom"><span>DNAture · Nutrición, educación y acompañamiento.</span><span>Prototipo de exploración · Sin compras habilitadas.</span></div>
  </footer>;
}
