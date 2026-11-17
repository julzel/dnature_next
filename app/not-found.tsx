import Link from "next/link";

export default function NotFound() {
  return <main id="contenido" className="shell article">
    <p className="eyebrow">404</p>
    <h1>Página no encontrada</h1>
    <p className="lead">No encontramos la página que buscás.</p>
    <Link href="/">Volver al inicio</Link>
  </main>;
}
