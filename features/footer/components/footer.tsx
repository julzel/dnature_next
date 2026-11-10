import Link from "next/link";
import { Logo } from "@/components/logo";
import styles from "./footer.module.css";

export function Footer() {
  return (
    <footer id="footer" className={styles.footer} aria-label="Pie de página">
      <div className={styles.container}>
        <div className={styles.brand}>
          <Link href="/" aria-label="DNAture, inicio"><Logo shape="full" color="white" size={150} alt="" /></Link>
          <p>Nutrición con esencia en el ADN.</p>
        </div>
        <nav aria-label="Explorar DNAture" className={styles.navigation}>
          <Link href="/productos">Productos</Link>
          <Link href="/nosotros">Nosotros</Link>
          <Link href="/#contacto">Contacto</Link>
        </nav>
        <p className={styles.note}>Elegir con información también es cuidar.</p>
      </div>
    </footer>
  );
}
